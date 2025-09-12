import { Supplier } from '../../suppliers/entities/supplier.entity';
import { PurchaseItem } from './purchase-item.entity';
export declare class Purchase {
    id: string;
    supplier: Supplier;
    items: PurchaseItem[];
    total: number;
    createdAt: Date;
}
