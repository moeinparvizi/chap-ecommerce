import { Controller, Get, Post, Put, Delete, Body, Param } from '@nestjs/common';
import { MarketingService } from './marketing.service';

@Controller('marketing')
export class MarketingController {
  constructor(private readonly marketingService: MarketingService) {}

  // Campaigns
  @Get('campaigns')
  findAllCampaigns() { return this.marketingService.findAllCampaigns(); }
  @Post('campaigns')
  createCampaign(@Body() body: any) { return this.marketingService.createCampaign(body); }
  @Put('campaigns/:id')
  updateCampaign(@Param('id') id: string, @Body() body: any) { return this.marketingService.updateCampaign(id, body); }
  @Delete('campaigns/:id')
  removeCampaign(@Param('id') id: string) { return this.marketingService.removeCampaign(id); }

  // Coupons
  @Get('coupons')
  findAllCoupons() { return this.marketingService.findAllCoupons(); }
  @Post('coupons')
  createCoupon(@Body() body: any) { return this.marketingService.createCoupon(body); }
  @Put('coupons/:id')
  updateCoupon(@Param('id') id: string, @Body() body: any) { return this.marketingService.updateCoupon(id, body); }
  @Delete('coupons/:id')
  removeCoupon(@Param('id') id: string) { return this.marketingService.removeCoupon(id); }

  // Banners
  @Get('banners')
  findAllBanners() { return this.marketingService.findAllBanners(); }
  @Post('banners')
  createBanner(@Body() body: any) { return this.marketingService.createBanner(body); }
  @Put('banners/:id')
  updateBanner(@Param('id') id: string, @Body() body: any) { return this.marketingService.updateBanner(id, body); }
  @Delete('banners/:id')
  removeBanner(@Param('id') id: string) { return this.marketingService.removeBanner(id); }
}
