import { Controller, Get, Post, Put, Delete, Body, Param, Query } from '@nestjs/common';
import { OrdersService } from './orders.service';

@Controller('orders')
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  @Get()
  findAll(@Query('userId') userId?: string) {
    if (userId) return this.ordersService.findByUser(userId);
    return this.ordersService.findAll();
  }

  @Post()
  create(@Body() body: any) { return this.ordersService.create(body); }

  @Put(':id')
  update(@Param('id') id: string, @Body() body: any) { return this.ordersService.update(id, body); }

  @Delete(':id')
  remove(@Param('id') id: string) { return this.ordersService.remove(id); }
}
