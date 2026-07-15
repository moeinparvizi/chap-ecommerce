import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class MarketingService {
  constructor(private prisma: PrismaService) {}

  // Campaigns
  async findAllCampaigns() { return this.prisma.campaign.findMany({ orderBy: { createdAt: 'desc' } }); }
  async createCampaign(data: any) { return this.prisma.campaign.create({ data }); }
  async updateCampaign(id: string, data: any) { return this.prisma.campaign.update({ where: { id }, data }); }
  async removeCampaign(id: string) { return this.prisma.campaign.delete({ where: { id } }); }

  // Coupons
  async findAllCoupons() { return this.prisma.coupon.findMany({ orderBy: { createdAt: 'desc' } }); }
  async createCoupon(data: any) { return this.prisma.coupon.create({ data }); }
  async updateCoupon(id: string, data: any) { return this.prisma.coupon.update({ where: { id }, data }); }
  async removeCoupon(id: string) { return this.prisma.coupon.delete({ where: { id } }); }

  // Banners
  async findAllBanners() {
    return this.prisma.banner.findMany({ include: { images: true }, orderBy: { createdAt: 'desc' } });
  }
  async createBanner(data: any) {
    const { images, ...bannerData } = data;
    return this.prisma.banner.create({
      data: {
        ...bannerData,
        images: images ? { create: images.map((img: any) => ({ url: img.url, name: img.name })) } : undefined,
      },
      include: { images: true },
    });
  }
  async updateBanner(id: string, data: any) {
    const { images, ...bannerData } = data;
    if (images) {
      await this.prisma.bannerImage.deleteMany({ where: { bannerId: id } });
      return this.prisma.banner.update({
        where: { id },
        data: { ...bannerData, images: { create: images.map((img: any) => ({ url: img.url, name: img.name })) } },
        include: { images: true },
      });
    }
    return this.prisma.banner.update({ where: { id }, data: bannerData, include: { images: true } });
  }
  async removeBanner(id: string) { return this.prisma.banner.delete({ where: { id } }); }
}
