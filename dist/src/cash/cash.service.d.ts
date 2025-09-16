import { Repository } from 'typeorm';
import { CashMovement } from './entities/cash-movement.entity';
export declare class CashService {
    private repo;
    constructor(repo: Repository<CashMovement>);
    create(body: {
        type: 'INCOME' | 'EXPENSE';
        amount: number;
        reason?: string;
    }): Promise<CashMovement>;
    findAll(): Promise<CashMovement[]>;
    getBalance(): Promise<{
        income: number;
        expense: number;
        balance: number;
    }>;
}
