import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CashMovement } from './entities/cash-movement.entity';
import { CashService } from './cash.service';
import { CashController } from './cash.controller';

@Module({
  imports: [TypeOrmModule.forFeature([CashMovement])],
  controllers: [CashController],
  providers: [CashService],
  exports: [CashService], // 👈 necesario para Orders/Purchases
})
export class CashModule {}
