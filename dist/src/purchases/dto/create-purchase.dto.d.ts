declare class CreatePurchaseItemInput {
    productId: string;
    qty: number;
    price: number;
}
export declare class CreatePurchaseDto {
    supplierId: string;
    items: CreatePurchaseItemInput[];
}
export {};
