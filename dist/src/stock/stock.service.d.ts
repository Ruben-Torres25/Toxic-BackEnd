import { Repository } from 'typeorm';
import { StockMovement } from './entities/stock-movement.entity';
import { Product } from '../products/entities/product.entity';
import { CreateStockMovementDto } from './dto/create-stock-movement.dto';
export declare class StockService {
    private movements;
    private products;
    constructor(movements: Repository<StockMovement>, products: Repository<Product>);
    create(dto: CreateStockMovementDto): Promise<StockMovement>;
    findAll(): Promise<StockMovement[]>;
}
