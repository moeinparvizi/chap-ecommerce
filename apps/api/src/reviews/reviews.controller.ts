import { Controller, Get, Post, Delete, Body, Param, Query } from '@nestjs/common';
import { ReviewsService } from './reviews.service';

@Controller('reviews')
export class ReviewsController {
  constructor(private reviewsService: ReviewsService) {}

  @Get() findAll(@Query('userId') userId?: string, @Query('productId') productId?: string) {
    if (userId) return this.reviewsService.findByUser(userId);
    if (productId) return this.reviewsService.findByProduct(productId);
    return this.reviewsService.findAll();
  }

  @Post() create(@Body() body: any) { return this.reviewsService.create(body); }
  @Delete(':id') remove(@Param('id') id: string) { return this.reviewsService.remove(id); }
}
