import { Controller, Get, Post, Put, Delete, Body, Param } from '@nestjs/common';
import { DiscountsService } from './discounts.service';

@Controller('discounts')
export class DiscountsController {
  constructor(private discountsService: DiscountsService) {}

  @Get() findAll() { return this.discountsService.findAll(); }
  @Post() create(@Body() body: any) { return this.discountsService.create(body); }
  @Put(':id') update(@Param('id') id: string, @Body() body: any) { return this.discountsService.update(id, body); }
  @Delete(':id') remove(@Param('id') id: string) { return this.discountsService.remove(id); }
}
