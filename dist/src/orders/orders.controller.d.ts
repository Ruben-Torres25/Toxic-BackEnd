import { OrdersService } from './orders.service';
import { CreateOrderDto } from './dto/create-order.dto';
export declare class OrdersController {
    private readonly service;
    constructor(service: OrdersService);
    list(): Promise<import("./entities/order.entity").Order[]>;
    create(dto: CreateOrderDto): Promise<import("./entities/order.entity").Order>;
    confirm(id: string): Promise<{
        ok: boolean;
    }>;
    cancel(id: string): Promise<{
        ok: boolean;
    }>;
}
