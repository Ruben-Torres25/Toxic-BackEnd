import { Repository, DataSource } from 'typeorm';
import { Order } from './entities/order.entity';
import { OrderItem } from './entities/order-item.entity';
import { Product } from '../products/entities/product.entity';
import { Customer } from '../customers/entities/customer.entity';
import { CreateOrderDto } from './dto/create-order.dto';
import { StockService } from '../stock/stock.service';
export declare class OrdersService {
    private orders;
    private items;
    private products;
    private customers;
    private dataSource;
    private stockService;
    constructor(orders: Repository<Order>, items: Repository<OrderItem>, products: Repository<Product>, customers: Repository<Customer>, dataSource: DataSource, stockService: StockService);
    list(): Promise<Order[]>;
    create(dto: CreateOrderDto): Promise<Order>;
    confirm(orderId: string): Promise<{
        ok: boolean;
    }>;
    cancel(orderId: string): Promise<{
        ok: boolean;
    }>;
}
