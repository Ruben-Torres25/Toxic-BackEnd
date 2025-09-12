import { Customer } from '../../customers/entities/customer.entity';
import { OrderItem } from './order-item.entity';
export type OrderStatus = 'PENDIENTE' | 'COMPLETADO' | 'CANCELADO';
export declare class Order {
    id: string;
    customer?: Customer;
    status: OrderStatus;
    subtotal: number;
    discount: number;
    total: number;
    notes: string;
    items: OrderItem[];
    createdAt: Date;
    updatedAt: Date;
}
