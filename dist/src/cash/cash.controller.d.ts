import { CashService } from './cash.service';
export declare class CashController {
    private readonly service;
    constructor(service: CashService);
    create(body: {
        type: 'INCOME' | 'EXPENSE';
        amount: number;
        reason?: string;
    }): Promise<import("./entities/cash-movement.entity").CashMovement>;
    findAll(): Promise<import("./entities/cash-movement.entity").CashMovement[]>;
    getBalance(): Promise<{
        income: number;
        expense: number;
        balance: number;
    }>;
}
