import { Product } from '../../products/entities/product.entity';
export type StockMovementType = 'IN' | 'OUT' | 'ADJUST';
export declare class StockMovement {
    id: string;
    product: Product;
    quantity: number;
    type: StockMovementType;
    reason: string;
    createdAt: Date;
}
