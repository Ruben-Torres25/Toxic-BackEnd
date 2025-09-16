"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CashModule = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const cash_movement_entity_1 = require("./entities/cash-movement.entity");
const cash_service_1 = require("./cash.service");
const cash_controller_1 = require("./cash.controller");
let CashModule = class CashModule {
};
exports.CashModule = CashModule;
exports.CashModule = CashModule = __decorate([
    (0, common_1.Module)({
        imports: [typeorm_1.TypeOrmModule.forFeature([cash_movement_entity_1.CashMovement])],
        providers: [cash_service_1.CashService],
        controllers: [cash_controller_1.CashController],
        exports: [cash_service_1.CashService],
    })
], CashModule);
//# sourceMappingURL=cash.module.js.map