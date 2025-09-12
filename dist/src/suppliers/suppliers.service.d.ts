import { Repository } from 'typeorm';
import { Supplier } from './entities/supplier.entity';
import { CreateSupplierDto } from './dto/create-supplier.dto';
import { UpdateSupplierDto } from './dto/update-supplier.dto';
export declare class SuppliersService {
    private repo;
    constructor(repo: Repository<Supplier>);
    findAll(query?: string, page?: number, limit?: number): Promise<{
        data: Supplier[];
        total: number;
        page: number;
        limit: number;
    }>;
    create(dto: CreateSupplierDto): Promise<Supplier>;
    findOne(id: string): Promise<Supplier>;
    update(id: string, dto: UpdateSupplierDto): Promise<Supplier>;
    remove(id: string): Promise<{
        ok: boolean;
    }>;
}
