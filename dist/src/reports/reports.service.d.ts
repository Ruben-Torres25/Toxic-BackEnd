import { Repository } from 'typeorm';
import { Order } from '../orders/entities/order.entity';
import { Product } from '../products/entities/product.entity';
export declare class ReportsService {
    private orders;
    private products;
    constructor(orders: Repository<Order>, products: Repository<Product>);
    sales(from?: string, to?: string): Promise<{
        total: number;
    }>;
    topProducts(limit?: number): Promise<any[]>;
    criticalStock(): Promise<Product[]>;
}
