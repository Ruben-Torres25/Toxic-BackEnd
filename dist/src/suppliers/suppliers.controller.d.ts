import { SuppliersService } from './suppliers.service';
import { CreateSupplierDto } from './dto/create-supplier.dto';
import { UpdateSupplierDto } from './dto/update-supplier.dto';
export declare class SuppliersController {
    private readonly service;
    constructor(service: SuppliersService);
    list(query?: string, page?: number, limit?: number): Promise<{
        data: import("./entities/supplier.entity").Supplier[];
        total: number;
        page: number;
        limit: number;
    }>;
    create(dto: CreateSupplierDto): Promise<import("./entities/supplier.entity").Supplier>;
    get(id: string): Promise<import("./entities/supplier.entity").Supplier>;
    update(id: string, dto: UpdateSupplierDto): Promise<import("./entities/supplier.entity").Supplier>;
    remove(id: string): Promise<{
        ok: boolean;
    }>;
}
