import { ProductsService } from './products.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
export declare class ProductsController {
    private readonly service;
    constructor(service: ProductsService);
    list(query?: string, page?: number, limit?: number): Promise<{
        data: import("./entities/product.entity").Product[];
        total: number;
        page: number;
        limit: number;
    }>;
    create(dto: CreateProductDto): Promise<import("./entities/product.entity").Product>;
    get(id: string): Promise<import("./entities/product.entity").Product>;
    update(id: string, body: UpdateProductDto): Promise<import("./entities/product.entity").Product>;
    remove(id: string): Promise<{
        ok: boolean;
    }>;
}
