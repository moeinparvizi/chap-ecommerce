import { Controller, Get, Post, Put, Delete, Body, Param } from '@nestjs/common';
import { CustomersService } from './customers.service';

@Controller('customers')
export class CustomersController {
  constructor(private readonly customersService: CustomersService) {}

  @Get()
  findAll() { return this.customersService.findAll(); }

  @Post()
  create(@Body() body: any) { return this.customersService.create(body); }

  @Put(':id')
  update(@Param('id') id: string, @Body() body: any) { return this.customersService.update(id, body); }

  @Delete(':id')
  remove(@Param('id') id: string) { return this.customersService.remove(id); }
}
