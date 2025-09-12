declare class CreateOrderItemInput {
    productId: string;
    qty: number;
    price: number;
}
export declare class CreateOrderDto {
    customerId?: string;
    notes?: string;
    items: CreateOrderItemInput[];
    discount?: number;
}
export {};
