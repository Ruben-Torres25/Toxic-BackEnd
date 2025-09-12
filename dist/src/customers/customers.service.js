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
exports.CustomersService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const customer_entity_1 = require("./entities/customer.entity");
let CustomersService = class CustomersService {
    constructor(repo) {
        this.repo = repo;
    }
    async findAll(query, page = 1, limit = 20) {
        const where = query ? [
            { name: (0, typeorm_2.ILike)(`%${query}%`) },
            { email: (0, typeorm_2.ILike)(`%${query}%`) }
        ] : {};
        const [data, total] = await this.repo.findAndCount({
            where,
            skip: (page - 1) * limit,
            take: limit,
            order: { createdAt: 'DESC' },
        });
        return { data, total, page, limit };
    }
    async create(dto) {
        return this.repo.save(this.repo.create(dto));
    }
    async findOne(id) {
        const customer = await this.repo.findOne({ where: { id } });
        if (!customer)
            throw new common_1.NotFoundException('Customer not found');
        return customer;
    }
    async update(id, dto) {
        const customer = await this.findOne(id);
        Object.assign(customer, dto);
        return this.repo.save(customer);
    }
    async remove(id) {
        await this.repo.delete(id);
        return { ok: true };
    }
};
exports.CustomersService = CustomersService;
exports.CustomersService = CustomersService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(customer_entity_1.Customer)),
    __metadata("design:paramtypes", [typeorm_2.Repository])
], CustomersService);
//# sourceMappingURL=customers.service.js.map