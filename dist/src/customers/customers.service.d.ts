import { Repository } from 'typeorm';
import { Customer } from './entities/customer.entity';
import { CreateCustomerDto } from './dto/create-customer.dto';
import { UpdateCustomerDto } from './dto/update-customer.dto';
export declare class CustomersService {
    private repo;
    constructor(repo: Repository<Customer>);
    findAll(query?: string, page?: number, limit?: number): Promise<{
        data: Customer[];
        total: number;
        page: number;
        limit: number;
    }>;
    create(dto: CreateCustomerDto): Promise<Customer>;
    findOne(id: string): Promise<Customer>;
    update(id: string, dto: UpdateCustomerDto): Promise<Customer>;
    remove(id: string): Promise<{
        ok: boolean;
    }>;
}
