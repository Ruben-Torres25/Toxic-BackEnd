import { CustomersService } from './customers.service';
import { CreateCustomerDto } from './dto/create-customer.dto';
import { UpdateCustomerDto } from './dto/update-customer.dto';
export declare class CustomersController {
    private readonly service;
    constructor(service: CustomersService);
    list(query?: string, page?: number, limit?: number): Promise<{
        data: import("./entities/customer.entity").Customer[];
        total: number;
        page: number;
        limit: number;
    }>;
    create(dto: CreateCustomerDto): Promise<import("./entities/customer.entity").Customer>;
    get(id: string): Promise<import("./entities/customer.entity").Customer>;
    update(id: string, dto: UpdateCustomerDto): Promise<import("./entities/customer.entity").Customer>;
    remove(id: string): Promise<{
        ok: boolean;
    }>;
}
