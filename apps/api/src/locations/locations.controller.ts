import { Controller, Get, Post, Put, Delete, Body, Param, Query } from '@nestjs/common';
import { LocationsService } from './locations.service';

@Controller('locations')
export class LocationsController {
  constructor(private locationsService: LocationsService) {}

  @Get() findAll(@Query('userId') userId?: string) {
    if (userId) return this.locationsService.findByUser(userId);
    return this.locationsService.findAll();
  }

  @Post() create(@Body() body: any) { return this.locationsService.create(body); }
  @Put(':id') update(@Param('id') id: string, @Body() body: any) { return this.locationsService.update(id, body); }
  @Delete(':id') remove(@Param('id') id: string) { return this.locationsService.remove(id); }
  @Put(':id/default') setDefault(@Param('id') id: string, @Body() body: any) { return this.locationsService.setDefault(body.userId, id); }
}
