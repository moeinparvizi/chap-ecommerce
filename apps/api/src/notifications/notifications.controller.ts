import { Controller, Get, Post, Put, Delete, Body, Param, Query } from '@nestjs/common';
import { NotificationsService } from './notifications.service';

@Controller('notifications')
export class NotificationsController {
  constructor(private notificationsService: NotificationsService) {}

  @Get() findAll(@Query('userId') userId: string) { return this.notificationsService.findByUser(userId); }

  @Put(':id/read') markRead(@Param('id') id: string) { return this.notificationsService.markRead(id); }

  @Put('read-all') markAllRead(@Query('userId') userId: string) { return this.notificationsService.markAllRead(userId); }

  @Delete(':id') remove(@Param('id') id: string) { return this.notificationsService.remove(id); }
}
