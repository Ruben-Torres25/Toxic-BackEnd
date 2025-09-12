import { Repository } from 'typeorm';
import { Product } from './entities/product.entity';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
export declare class ProductsService {
    private repo;
    constructor(repo: Repository<Product>);
    findAll(query?: string, page?: number, limit?: number): Promise<{
        data: Product[];
        total: number;
        page: number;
        limit: number;
    }>;
    create(dto: CreateProductDto): Promise<Product>;
    findOne(id: string): Promise<Product>;
    update(id: string, partial: UpdateProductDto): Promise<Product>;
    remove(id: string): Promise<{
        ok: boolean;
    }>;
}
