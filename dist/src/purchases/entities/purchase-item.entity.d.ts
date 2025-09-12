import { Product } from '../../products/entities/product.entity';
import { Purchase } from './purchase.entity';
export declare class PurchaseItem {
    id: string;
    purchase: Purchase;
    product: Product;
    qty: number;
    price: number;
    subtotal: number;
}
