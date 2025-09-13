import { StockService } from './stock.service';
export declare class StockController {
    private readonly service;
    constructor(service: StockService);
    findAll(query?: string): Promise<import("./entities/stock-movement.entity").StockMovement[]>;
}
