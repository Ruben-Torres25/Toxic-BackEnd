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
exports.ReportsService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const order_entity_1 = require("../orders/entities/order.entity");
const product_entity_1 = require("../products/entities/product.entity");
let ReportsService = class ReportsService {
    constructor(orders, products) {
        this.orders = orders;
        this.products = products;
    }
    async sales(from, to) {
        const qb = this.orders.createQueryBuilder('o')
            .where('o.status = :status', { status: 'COMPLETADO' });
        if (from)
            qb.andWhere('o.createdAt >= :from', { from });
        if (to)
            qb.andWhere('o.createdAt <= :to', { to });
        const total = await qb.select('SUM(o.total)', 'sum').getRawOne();
        return { total: Number(total.sum) || 0 };
    }
    async topProducts(limit = 5) {
        const qb = this.orders.createQueryBuilder('o')
            .leftJoin('o.items', 'i')
            .leftJoin('i.product', 'p')
            .select('p.name', 'name')
            .addSelect('SUM(i.qty)', 'qty')
            .where('o.status = :status', { status: 'COMPLETADO' })
            .groupBy('p.id')
            .orderBy('qty', 'DESC')
            .limit(limit);
        return qb.getRawMany();
    }
    async criticalStock() {
        const critical = await this.products.createQueryBuilder('p')
            .where('p.stock <= p.stockMin')
            .getMany();
        return critical;
    }
};
exports.ReportsService = ReportsService;
exports.ReportsService = ReportsService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(order_entity_1.Order)),
    __param(1, (0, typeorm_1.InjectRepository)(product_entity_1.Product)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository])
], ReportsService);
//# sourceMappingURL=reports.service.js.map