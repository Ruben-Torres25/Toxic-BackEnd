import { Repository } from 'typeorm';
import { Purchase } from './entities/purchase.entity';
import { PurchaseItem } from './entities/purchase-item.entity';
import { Product } from '../products/entities/product.entity';
import { Supplier } from '../suppliers/entities/supplier.entity';
import { CreatePurchaseDto } from './dto/create-purchase.dto';
import { StockService } from '../stock/stock.service';
import { CashService } from '../cash/cash.service';
export declare class PurchasesService {
    private purchases;
    private items;
    private products;
    private suppliers;
    private stockService;
    private cashService;
    constructor(purchases: Repository<Purchase>, items: Repository<PurchaseItem>, products: Repository<Product>, suppliers: Repository<Supplier>, stockService: StockService, cashService: CashService);
    findAll(): Promise<Purchase[]>;
    create(dto: CreatePurchaseDto): Promise<Purchase>;
}
