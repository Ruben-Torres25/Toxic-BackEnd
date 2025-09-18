import { IsArray, IsDateString, IsOptional, IsString, ValidateNested, IsUUID, IsInt, Min, IsNumber } from 'class-validator';
import { Type } from 'class-transformer';

class PurchaseItemInput {
  @IsUUID()
  productId: string;

  @IsInt()
  @Min(1)
  quantity: number;

  @IsNumber()
  @Min(0)
  unitCost: number;
}

export class CreatePurchaseDto {
  @IsUUID()
  supplierId: string;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => PurchaseItemInput)
  items: PurchaseItemInput[];

  @IsDateString()
  purchasedAt: string; // ISO

  @IsOptional()
  @IsString()
  notes?: string;
}
