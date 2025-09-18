import { IsEnum, IsNumber, IsOptional, IsString, Min } from 'class-validator';
import { CashMovementType } from '../entities/cash-movement.entity';

export class CreateMovementDto {
  @IsEnum(CashMovementType)
  type: CashMovementType;

  @IsNumber()
  @Min(0.01)
  amount: number;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsString()
  referenceId?: string;

  @IsOptional()
  @IsString()
  referenceType?: string;
}
