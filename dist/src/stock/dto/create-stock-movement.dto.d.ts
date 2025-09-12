export declare class CreateStockMovementDto {
    productId: string;
    quantity: number;
    type: 'IN' | 'OUT' | 'ADJUST';
    reason?: string;
}
