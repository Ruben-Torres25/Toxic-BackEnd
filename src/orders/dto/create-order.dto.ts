import { Type } from 'class-transformer';
import { IsArray, IsNotEmpty, IsNumber, IsOptional, IsString, Min, ValidateNested, IsUUID } from 'class-validator';

class CreateOrderItemInput {
  @IsUUID() productId: string;
  @IsNumber() @Min(1) qty: number;
  @IsNumber() @Min(0) price: number;
}

export class CreateOrderDto {
  @IsUUID() @IsOptional() customerId?: string;   // 👈 ahora aceptamos cliente
  @IsString() @IsOptional() notes?: string;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateOrderItemInput)
  items: CreateOrderItemInput[];

  @IsNumber() @Min(0) @IsOptional() discount?: number;
}
