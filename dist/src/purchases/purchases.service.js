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
const supplier_entity_1 = require("../suppliers/entities/supplier.entity");
const product_entity_1 = require("../products/entities/product.entity");
const stock_service_1 = require("../stock/stock.service");
let PurchasesService = class PurchasesService {
    constructor(purchases, items, suppliers, products, dataSource, stockService) {
        this.purchases = purchases;
        this.items = items;
        this.suppliers = suppliers;
        this.products = products;
        this.dataSource = dataSource;
        this.stockService = stockService;
    }
    async create(dto) {
        const supplier = await this.suppliers.findOne({ where: { id: dto.supplierId } });
        if (!supplier)
            throw new common_1.NotFoundException('Proveedor no encontrado');
        let total = 0;
        const items = [];
        await this.dataSource.transaction(async (trx) => {
            for (const it of dto.items) {
                const product = await this.products.findOne({ where: { id: it.productId } });
                if (!product)
                    throw new common_1.NotFoundException('Producto no encontrado');
                const subtotal = Number(it.price) * it.qty;
                total += subtotal;
                product.stock += it.qty;
                product.cost = it.price;
                await trx.getRepository(product_entity_1.Product).save(product);
                await this.stockService.create({
                    productId: product.id,
                    quantity: it.qty,
                    type: 'IN',
                    reason: `Compra a proveedor ${supplier.name}`,
                });
                const item = this.items.create({ product, qty: it.qty, price: it.price, subtotal });
                items.push(item);
            }
            const purchase = this.purchases.create({
                supplier,
                items,
                total,
            });
            await trx.getRepository(purchase_entity_1.Purchase).save(purchase);
        });
        return { ok: true };
    }
    async findAll() {
        return this.purchases.find({ order: { createdAt: 'DESC' } });
    }
};
exports.PurchasesService = PurchasesService;
exports.PurchasesService = PurchasesService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(purchase_entity_1.Purchase)),
    __param(1, (0, typeorm_1.InjectRepository)(purchase_item_entity_1.PurchaseItem)),
    __param(2, (0, typeorm_1.InjectRepository)(supplier_entity_1.Supplier)),
    __param(3, (0, typeorm_1.InjectRepository)(product_entity_1.Product)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.DataSource,
        stock_service_1.StockService])
], PurchasesService);
//# sourceMappingURL=purchases.service.js.map