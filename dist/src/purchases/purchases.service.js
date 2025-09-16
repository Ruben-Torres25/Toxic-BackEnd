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
exports.PurchasesService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const purchase_entity_1 = require("./entities/purchase.entity");
const purchase_item_entity_1 = require("./entities/purchase-item.entity");
const product_entity_1 = require("../products/entities/product.entity");
const supplier_entity_1 = require("../suppliers/entities/supplier.entity");
const stock_service_1 = require("../stock/stock.service");
const cash_service_1 = require("../cash/cash.service");
let PurchasesService = class PurchasesService {
    constructor(purchases, items, products, suppliers, stockService, cashService) {
        this.purchases = purchases;
        this.items = items;
        this.products = products;
        this.suppliers = suppliers;
        this.stockService = stockService;
        this.cashService = cashService;
    }
    async findAll() {
        return this.purchases.find({ relations: ['items', 'supplier'] });
    }
    async create(dto) {
        const supplier = await this.suppliers.findOne({ where: { id: dto.supplierId } });
        if (!supplier)
            throw new common_1.NotFoundException('Proveedor no encontrado');
        let total = 0;
        const purchase = this.purchases.create({
            supplier,
            items: [],
        });
        for (const it of dto.items) {
            const p = await this.products.findOne({ where: { id: it.productId } });
            if (!p)
                throw new common_1.NotFoundException('Producto no encontrado');
            const subtotal = it.price * it.qty;
            total += subtotal;
            const item = this.items.create({
                product: p,
                qty: it.qty,
                price: it.price,
                subtotal,
            });
            purchase.items.push(item);
            p.stock += it.qty;
            await this.products.save(p);
            await this.stockService.create({
                productId: p.id,
                quantity: it.qty,
                type: 'IN',
                reason: `Compra a proveedor - ${supplier.name}`,
            });
        }
        purchase.total = total;
        await this.purchases.save(purchase);
        await this.cashService.create({
            type: 'EXPENSE',
            amount: total,
            reason: `Compra proveedor - ${supplier.name}`,
        });
        return purchase;
    }
};
exports.PurchasesService = PurchasesService;
exports.PurchasesService = PurchasesService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(purchase_entity_1.Purchase)),
    __param(1, (0, typeorm_1.InjectRepository)(purchase_item_entity_1.PurchaseItem)),
    __param(2, (0, typeorm_1.InjectRepository)(product_entity_1.Product)),
    __param(3, (0, typeorm_1.InjectRepository)(supplier_entity_1.Supplier)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        stock_service_1.StockService,
        cash_service_1.CashService])
], PurchasesService);
//# sourceMappingURL=purchases.service.js.map