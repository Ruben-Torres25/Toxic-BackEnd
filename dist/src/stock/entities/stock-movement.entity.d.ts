import { Product } from '../../products/entities/product.entity';
export declare class StockMovement {
    id: string;
    product: Product;
    quantity: number;
    type: 'IN' | 'OUT';
    reason: string;
    createdAt: Date;
}
