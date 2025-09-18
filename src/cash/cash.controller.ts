import { Body, Controller, Get, Param, Post, Query } from '@nestjs/common';
import { CashService } from './cash.service';
import { OpenCashDto } from './dto/open-cash.dto';
import { CloseCashDto } from './dto/close-cash.dto';
import { CreateMovementDto } from './dto/create-movement.dto';

@Controller('cash')
export class CashController {
  constructor(private readonly cashService: CashService) {}

  // Obtener la caja actualmente abierta
  @Get('current')
  getCurrent() {
    return this.cashService.getCurrentOpen();
  }

  // Abrir caja
  @Post('open')
  open(@Body() dto: OpenCashDto) {
    return this.cashService.open(dto);
  }

  // Cerrar caja
  @Post('close')
  close(@Body() dto: CloseCashDto) {
    return this.cashService.close(dto);
  }

  // Registrar un movimiento (ingreso/egreso/venta)
  @Post('movements')
  addMovement(@Body() dto: CreateMovementDto) {
    return this.cashService.addMovement(dto);
  }

  // Reporte de caja por fecha
  @Get('report')
  report(@Query('date') date: string) {
    // date en formato YYYY-MM-DD
    return this.cashService.reportForDate(date);
  }

  // Buscar caja por ID
  @Get(':id')
  getById(@Param('id') id: string) {
    return this.cashService.getById(id);
  }
}
