import { Repository, DataSource } from 'typeorm';
import { Purchase } from './entities/purchase.entity';
import { PurchaseItem } from './entities/purchase-item.entity';
import { Supplier } from '../suppliers/entities/supplier.entity';
import { Product } from '../products/entities/product.entity';
import { CreatePurchaseDto } from './dto/create-purchase.dto';
import { StockService } from '../stock/stock.service';
export declare class PurchasesService {
    private purchases;
    private items;
    private suppliers;
    private products;
    private dataSource;
    private stockService;
    constructor(purchases: Repository<Purchase>, items: Repository<PurchaseItem>, suppliers: Repository<Supplier>, products: Repository<Product>, dataSource: DataSource, stockService: StockService);
    create(dto: CreatePurchaseDto): Promise<{
        ok: boolean;
    }>;
    findAll(): Promise<Purchase[]>;
}
