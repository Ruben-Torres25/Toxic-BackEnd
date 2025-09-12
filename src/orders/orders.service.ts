import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DataSource } from 'typeorm';
import { Order } from './entities/order.entity';
import { OrderItem } from './entities/order-item.entity';
import { Product } from '../products/entities/product.entity';
import { Customer } from '../customers/entities/customer.entity';
import { CreateOrderDto } from './dto/create-order.dto';
import { StockService } from '../stock/stock.service';

@Injectable()
export class OrdersService {
  constructor(
    @InjectRepository(Order) private orders: Repository<Order>,
    @InjectRepository(OrderItem) private items: Repository<OrderItem>,
    @InjectRepository(Product) private products: Repository<Product>,
    @InjectRepository(Customer) private customers: Repository<Customer>,
    private dataSource: DataSource,
    private stockService: StockService,   // 👈 inyectamos StockService
  ) {}

  async list() {
    return this.orders.find({
      relations: ['items', 'items.product', 'customer'],
      order: { createdAt: 'DESC' },
    });
  }

  async create(dto: CreateOrderDto) {
    if (!dto.items || dto.items.length === 0) {
      throw new BadRequestException('Order must have items');
    }

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
      const total = price * it.qty;
      subtotal += total;
      const item = this.items.create({ product: p, qty: it.qty, price, total });
      order.items.push(item);
    }

    order.subtotal = subtotal;
    order.total = subtotal - (order.discount || 0);

    return this.orders.save(order);
  }

  async confirm(orderId: string) {
    const order = await this.orders.findOne({
      where: { id: orderId },
      relations: ['items', 'items.product'],
    });
    if (!order) throw new NotFoundException('Order not found');
    if (order.status !== 'PENDIENTE') throw new BadRequestException('Estado inválido');

    await this.dataSource.transaction(async (trx) => {
      for (const it of order.items) {
        const p = await trx.getRepository(Product).findOne({ where: { id: it.product.id } });
        if (!p) throw new NotFoundException('Producto no encontrado');
        if (p.stock < it.qty) throw new BadRequestException(`Stock insuficiente para ${p.name}`);
        p.stock -= it.qty;
        await trx.getRepository(Product).save(p);

        // 👇 Registramos movimiento de stock (salida por venta)
        await this.stockService.create({
          productId: p.id,
          quantity: it.qty,
          type: 'OUT',
          reason: `Venta confirmada - Pedido ${order.id}`,
        });
      }
      order.status = 'COMPLETADO';
      await trx.getRepository(Order).save(order);
    });

    return { ok: true };
  }

  async cancel(orderId: string) {
    const order = await this.orders.findOne({
      where: { id: orderId },
      relations: ['items', 'items.product'],
    });
    if (!order) throw new NotFoundException('Order not found');
    if (order.status !== 'PENDIENTE') {
      throw new BadRequestException('Solo se pueden cancelar pedidos pendientes');
    }

    await this.dataSource.transaction(async (trx) => {
      for (const it of order.items) {
        const p = await trx.getRepository(Product).findOne({ where: { id: it.product.id } });
        if (!p) throw new NotFoundException('Producto no encontrado');
        p.stock += it.qty;
        await trx.getRepository(Product).save(p);

        // 👇 Registramos movimiento de stock (entrada por cancelación)
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
