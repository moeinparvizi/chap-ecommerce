import { Controller, Get, Post, Put, Delete, Body, Param, Query } from '@nestjs/common';
import { CommentsService } from './comments.service';

@Controller('comments')
export class CommentsController {
  constructor(private commentsService: CommentsService) {}

  @Get() findAll(@Query('userId') userId?: string, @Query('productId') productId?: string) {
    if (userId) return this.commentsService.findByUser(userId);
    if (productId) return this.commentsService.findByProduct(productId);
    return this.commentsService.findAll();
  }

  @Post() create(@Body() body: any) { return this.commentsService.create(body); }

  @Put(':id') reply(@Param('id') id: string, @Body() body: any) { return this.commentsService.reply(id, body.reply); }

  @Delete(':id') remove(@Param('id') id: string) { return this.commentsService.remove(id); }
}
