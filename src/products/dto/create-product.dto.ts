import { IsBoolean, IsInt, IsNotEmpty, IsNumber, IsOptional, IsString, Min } from 'class-validator';

export class CreateProductDto {
  @IsString() @IsNotEmpty() sku: string;
  @IsString() @IsNotEmpty() name: string;
  @IsString() @IsOptional() description?: string;
  @IsNumber() @Min(0) price: number;
  @IsNumber() @Min(0) cost: number;
  @IsInt() @Min(0) stock: number;
  @IsInt() @Min(0) stockMin: number;
  @IsBoolean() @IsOptional() isActive?: boolean;
}
