import { PurchasesService } from './purchases.service';
import { CreatePurchaseDto } from './dto/create-purchase.dto';
export declare class PurchasesController {
    private readonly service;
    constructor(service: PurchasesService);
    list(): Promise<import("./entities/purchase.entity").Purchase[]>;
    create(dto: CreatePurchaseDto): Promise<import("./entities/purchase.entity").Purchase>;
}
