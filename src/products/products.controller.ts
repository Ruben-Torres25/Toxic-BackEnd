import { Body, Controller, DefaultValuePipe, Delete, Get, Param, ParseIntPipe, Patch, Post, Query } from '@nestjs/common';
import { ProductsService } from './products.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';

@Controller('products')
export class ProductsController {
  constructor(private readonly service: ProductsService) {}

  @Get()
  list(
    @Query('query') query?: string,
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page?: number,
    @Query('limit', new DefaultValuePipe(20), ParseIntPipe) limit?: number,
  ) { return this.service.findAll(query, page, limit); }

  @Post()
  create(@Body() dto: CreateProductDto) { return this.service.create(dto); }

  @Get(':id') get(@Param('id') id: string) { return this.service.findOne(id); }

  @Patch(':id') update(@Param('id') id: string, @Body() body: UpdateProductDto) { return this.service.update(id, body); }

  @Delete(':id') remove(@Param('id') id: string) { return this.service.remove(id); }
}
