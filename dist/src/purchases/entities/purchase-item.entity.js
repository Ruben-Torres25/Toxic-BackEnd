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
Object.defineProperty(exports, "__esModule", { value: true });
exports.PurchaseItem = void 0;
const typeorm_1 = require("typeorm");
const purchase_entity_1 = require("./purchase.entity");
const product_entity_1 = require("../../products/entities/product.entity");
let PurchaseItem = class PurchaseItem {
};
exports.PurchaseItem = PurchaseItem;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)('uuid'),
    __metadata("design:type", String)
], PurchaseItem.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => purchase_entity_1.Purchase, (purchase) => purchase.items, { onDelete: 'CASCADE' }),
    __metadata("design:type", purchase_entity_1.Purchase)
], PurchaseItem.prototype, "purchase", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => product_entity_1.Product, { eager: true }),
    __metadata("design:type", product_entity_1.Product)
], PurchaseItem.prototype, "product", void 0);
__decorate([
    (0, typeorm_1.Column)('int'),
    __metadata("design:type", Number)
], PurchaseItem.prototype, "qty", void 0);
__decorate([
    (0, typeorm_1.Column)('decimal', { precision: 10, scale: 2 }),
    __metadata("design:type", Number)
], PurchaseItem.prototype, "price", void 0);
__decorate([
    (0, typeorm_1.Column)('decimal', { precision: 10, scale: 2 }),
    __metadata("design:type", Number)
], PurchaseItem.prototype, "subtotal", void 0);
exports.PurchaseItem = PurchaseItem = __decorate([
    (0, typeorm_1.Entity)('purchase_items')
], PurchaseItem);
//# sourceMappingURL=purchase-item.entity.js.map