import { StockService } from './stock.service';
import { CreateStockMovementDto } from './dto/create-stock-movement.dto';
export declare class StockController {
    private readonly service;
    constructor(service: StockService);
    list(): Promise<import("./entities/stock-movement.entity").StockMovement[]>;
    create(dto: CreateStockMovementDto): Promise<import("./entities/stock-movement.entity").StockMovement>;
}
