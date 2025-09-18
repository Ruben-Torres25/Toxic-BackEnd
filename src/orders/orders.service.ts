import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';
import { Order } from './entities/order.entity';
import { OrderItem } from './entities/order-item.entity';
import { Product } from '../products/entities/product.entity';
import { Customer } from '../customers/entities/customer.entity';
import { CreateOrderDto } from './dto/create-order.dto';
import { StockService } from '../stock/stock.service';
import { CashService } from '../cash/cash.service';

@Injectable()
export class OrdersService {
  constructor(
    @InjectRepository(Order) private readonly orders: Repository<Order>,
    @InjectRepository(OrderItem) private readonly items: Repository<OrderItem>,
    @InjectRepository(Product) private readonly products: Repository<Product>,
    @InjectRepository(Customer) private readonly customers: Repository<Customer>,
    private readonly dataSource: DataSource,
    private readonly stockService: StockService,
    private readonly cashService: CashService,
  ) {}

  list() {
    return this.orders.find({
      relations: ['items', 'items.product', 'customer'],
      order: { createdAt: 'DESC' },
    });
  }

  async create(dto: CreateOrderDto) {
    if (!dto.items?.length) throw new BadRequestException('Order must have items');

    let subtotal = 0;
    const order = this.orders.create({
      status: 'PENDIENTE',
      discount: dto.discount || 0,
      notes: dto.notes || '',
    });

    if (dto.customerId) {
      const customer = await this.customers.findOne({ where: { id: dto.customerId } });
      if (!customer) throw new NotFoundException('Customer not found');
      order.customer = customer;
    }

    order.items = [];
    for (const it of dto.items) {
      const p = await this.products.findOne({ where: { id: it.productId } });
      if (!p) throw new NotFoundException('Producto no encontrado');
      const price = it.price ?? Number(p.price);
      const subtotalItem = price * it.qty;
      subtotal += subtotalItem;
      const item = this.items.create({ product: p, qty: it.qty, price, subtotal: subtotalItem });
      order.items.push(item);
    }

    order.subtotal = subtotal;
    order.total = subtotal - (order.discount || 0);
    return this.orders.save(order);
  }

  async confirm(orderId: string) {
    const order = await this.orders.findOne({
      where: { id: orderId },
      relations: ['items', 'items.product', 'customer'],
    });
    if (!order) throw new NotFoundException('Order not found');
    if (order.status !== 'PENDIENTE') throw new BadRequestException('Estado inválido');

    await this.dataSource.transaction(async trx => {
      // Descontar stock
      for (const it of order.items) {
        const p = await trx.getRepository(Product).findOne({ where: { id: it.product.id } });
        if (!p) throw new NotFoundException('Producto no encontrado');
        if (p.stock < it.qty) throw new BadRequestException(`Stock insuficiente para ${p.name}`);

        p.stock -= it.qty;
        await trx.getRepository(Product).save(p);

        await this.stockService.create({
          productId: p.id,
          quantity: it.qty,
          type: 'OUT',
          reason: `Venta confirmada - Pedido ${order.id}`,
        });
      }

      // Cambiar estado
      order.status = 'COMPLETADO';
      await trx.getRepository(Order).save(order);

      // Registrar venta en caja
      await this.cashService.recordSale(Number(order.total), order.id);

      // ⚡ Actualizar saldo del cliente
      if (order.customer) {
        const customerRepo = trx.getRepository(Customer);
        const c = await customerRepo.findOne({ where: { id: order.customer.id } });
        if (!c) throw new NotFoundException('Cliente no encontrado');

        // Por ahora asumimos que paga el total. Más adelante podremos manejar pagos parciales.
        const newBalance = Number(c.balance) - Number(order.total);
        c.balance = newBalance.toFixed(2);
        await customerRepo.save(c);
      }
    });

    return { ok: true };
  }

  async cancel(orderId: string) {
    const order = await this.orders.findOne({
      where: { id: orderId },
      relations: ['items', 'items.product'],
    });
    if (!order) throw new NotFoundException('Order not found');
    if (order.status !== 'PENDIENTE') throw new BadRequestException('Solo se pueden cancelar pedidos pendientes');

    await this.dataSource.transaction(async trx => {
      for (const it of order.items) {
        const p = await trx.getRepository(Product).findOne({ where: { id: it.product.id } });
        if (!p) throw new NotFoundException('Producto no encontrado');

        p.stock += it.qty;
        await trx.getRepository(Product).save(p);

        await this.stockService.create({
          productId: p.id,
          quantity: it.qty,
          type: 'IN',
          reason: `Cancelación de pedido ${order.id}`,
        });
      }

      order.status = 'CANCELADO';
      await trx.getRepository(Order).save(order);
    });

    return { ok: true };
  }
}
