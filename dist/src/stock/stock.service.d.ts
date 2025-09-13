import { Repository } from 'typeorm';
import { StockMovement } from './entities/stock-movement.entity';
import { Product } from '../products/entities/product.entity';
export declare class StockService {
    private movements;
    private products;
    constructor(movements: Repository<StockMovement>, products: Repository<Product>);
    create(data: {
        productId: string;
        quantity: number;
        type: 'IN' | 'OUT';
        reason?: string;
    }): Promise<StockMovement>;
    findAll(query?: string): Promise<StockMovement[]>;
}
