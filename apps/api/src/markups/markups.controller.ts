import { Controller, Get, Post, Put, Delete, Body, Param } from '@nestjs/common';
import { MarkupsService } from './markups.service';

@Controller('markups')
export class MarkupsController {
  constructor(private markupsService: MarkupsService) {}

  @Get() findAll() { return this.markupsService.findAll(); }
  @Post() create(@Body() body: any) { return this.markupsService.create(body); }
  @Put(':id') update(@Param('id') id: string, @Body() body: any) { return this.markupsService.update(id, body); }
  @Delete(':id') remove(@Param('id') id: string) { return this.markupsService.remove(id); }
}
