import { ReportsService } from './reports.service';
export declare class ReportsController {
    private readonly service;
    constructor(service: ReportsService);
    sales(from?: string, to?: string): Promise<{
        total: number;
    }>;
    topProducts(limit?: string): Promise<any[]>;
    criticalStock(): Promise<import("../products/entities/product.entity").Product[]>;
}
