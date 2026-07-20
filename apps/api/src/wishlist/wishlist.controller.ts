import { Controller, Get, Post, Delete, Body, Param, Query } from '@nestjs/common';
import { WishlistService } from './wishlist.service';

@Controller('wishlist')
export class WishlistController {
  constructor(private wishlistService: WishlistService) {}

  @Get() findAll(@Query('userId') userId: string) { return this.wishlistService.findByUser(userId); }
  @Post('toggle') toggle(@Body() body: any) { return this.wishlistService.toggle(body.userId, body); }
  @Delete(':id') remove(@Param('id') id: string) { return this.wishlistService.remove(id); }
}
