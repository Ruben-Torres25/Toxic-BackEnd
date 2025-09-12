"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.OrdersService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const order_entity_1 = require("./entities/order.entity");
const order_item_entity_1 = require("./entities/order-item.entity");
const product_entity_1 = require("../products/entities/product.entity");
const customer_entity_1 = require("../customers/entities/customer.entity");
const stock_service_1 = require("../stock/stock.service");
let OrdersService = class OrdersService {
    constructor(orders, items, products, customers, dataSource, stockService) {
        this.orders = orders;
        this.items = items;
        this.products = products;
        this.customers = customers;
        this.dataSource = dataSource;
        this.stockService = stockService;
    }
    async list() {
        return this.orders.find({
            relations: ['items', 'items.product', 'customer'],
            order: { createdAt: 'DESC' },
        });
    }
    async create(dto) {
        var _a;
        if (!dto.items || dto.items.length === 0) {
            throw new common_1.BadRequestException('Order must have items');
        }
        let subtotal = 0;
        const order = this.orders.create({
            status: 'PENDIENTE',
            discount: dto.discount || 0,
            notes: dto.notes || '',
        });
        if (dto.customerId) {
            const customer = await this.customers.findOne({ where: { id: dto.customerId } });
            if (!customer)
                throw new common_1.NotFoundException('Customer not found');
            order.customer = customer;
        }
        order.items = [];
        for (const it of dto.items) {
            const p = await this.products.findOne({ where: { id: it.productId } });
            if (!p)
                throw new common_1.NotFoundException('Producto no encontrado');
            const price = (_a = it.price) !== null && _a !== void 0 ? _a : Number(p.price);
            const total = price * it.qty;
            subtotal += total;
            const item = this.items.create({ product: p, qty: it.qty, price, total });
            order.items.push(item);
        }
        order.subtotal = subtotal;
        order.total = subtotal - (order.discount || 0);
        return this.orders.save(order);
    }
    async confirm(orderId) {
        const order = await this.orders.findOne({
            where: { id: orderId },
            relations: ['items', 'items.product'],
        });
        if (!order)
            throw new common_1.NotFoundException('Order not found');
        if (order.status !== 'PENDIENTE')
            throw new common_1.BadRequestException('Estado inválido');
        await this.dataSource.transaction(async (trx) => {
            for (const it of order.items) {
                const p = await trx.getRepository(product_entity_1.Product).findOne({ where: { id: it.product.id } });
                if (!p)
                    throw new common_1.NotFoundException('Producto no encontrado');
                if (p.stock < it.qty)
                    throw new common_1.BadRequestException(`Stock insuficiente para ${p.name}`);
                p.stock -= it.qty;
                await trx.getRepository(product_entity_1.Product).save(p);
                await this.stockService.create({
                    productId: p.id,
                    quantity: it.qty,
                    type: 'OUT',
                    reason: `Venta confirmada - Pedido ${order.id}`,
                });
            }
            order.status = 'COMPLETADO';
            await trx.getRepository(order_entity_1.Order).save(order);
        });
        return { ok: true };
    }
    async cancel(orderId) {
        const order = await this.orders.findOne({
            where: { id: orderId },
            relations: ['items', 'items.product'],
        });
        if (!order)
            throw new common_1.NotFoundException('Order not found');
        if (order.status !== 'PENDIENTE') {
            throw new common_1.BadRequestException('Solo se pueden cancelar pedidos pendientes');
        }
        await this.dataSource.transaction(async (trx) => {
            for (const it of order.items) {
                const p = await trx.getRepository(product_entity_1.Product).findOne({ where: { id: it.product.id } });
                if (!p)
                    throw new common_1.NotFoundException('Producto no encontrado');
                p.stock += it.qty;
                await trx.getRepository(product_entity_1.Product).save(p);
                await this.stockService.create({
                    productId: p.id,
                    quantity: it.qty,
                    type: 'IN',
                    reason: `Cancelación de pedido ${order.id}`,
                });
            }
            order.status = 'CANCELADO';
            await trx.getRepository(order_entity_1.Order).save(order);
        });
        return { ok: true };
    }
};
exports.OrdersService = OrdersService;
exports.OrdersService = OrdersService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(order_entity_1.Order)),
    __param(1, (0, typeorm_1.InjectRepository)(order_item_entity_1.OrderItem)),
    __param(2, (0, typeorm_1.InjectRepository)(product_entity_1.Product)),
    __param(3, (0, typeorm_1.InjectRepository)(customer_entity_1.Customer)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.DataSource,
        stock_service_1.StockService])
], OrdersService);
//# sourceMappingURL=orders.service.js.map