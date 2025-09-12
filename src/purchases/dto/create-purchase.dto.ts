import { Type } from 'class-transformer';
import { IsArray, IsNotEmpty, IsNumber, IsUUID, Min, ValidateNested } from 'class-validator';

class CreatePurchaseItemInput {
  @IsUUID() productId: string;
  @IsNumber() @Min(1) qty: number;
  @IsNumber() @Min(0) price: number;
}

export class CreatePurchaseDto {
  @IsUUID() @IsNotEmpty() supplierId: string;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreatePurchaseItemInput)
  items: CreatePurchaseItemInput[];
}
