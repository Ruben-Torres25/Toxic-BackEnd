import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Cashbox } from './entities/cashbox.entity';
import { CashMovement } from './entities/cash-movement.entity';
import { CashService } from './cash.service';
import { CashController } from './cash.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Cashbox, CashMovement])],
  controllers: [CashController],
  providers: [CashService],
  exports: [CashService],
})
export class CashModule {}
