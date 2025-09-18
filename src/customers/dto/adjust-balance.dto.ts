import { IsNumber, IsString } from 'class-validator';

export class AdjustBalanceDto {
  @IsNumber()
  amount: number; // puede ser positivo o negativo

  @IsString()
  reason: string;
}
