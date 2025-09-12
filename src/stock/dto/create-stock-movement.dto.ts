import { IsEnum, IsInt, IsNotEmpty, IsOptional, IsString, IsUUID, Min } from 'class-validator';

export class CreateStockMovementDto {
  @IsUUID()
  productId: string;

  @IsInt()
  @Min(1)
  quantity: number;

  @IsEnum(['IN', 'OUT', 'ADJUST'])
  type: 'IN' | 'OUT' | 'ADJUST';

  @IsString()
  @IsOptional()
  reason?: string;
}
