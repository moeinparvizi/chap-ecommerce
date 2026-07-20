import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { DiscountsService } from '../discounts/discounts.service';
import { MarkupsService } from '../markups/markups.service';

@Injectable()
export class ProductsService {
  constructor(private prisma: PrismaService, private discountsService: DiscountsService, private markupsService: MarkupsService) {}

  async findAll() {
    const products = await this.prisma.product.findMany({
      include: { images: true, category: true },
      orderBy: { createdAt: 'desc' },
    });
    const discounted = await this.discountsService.applyDiscounts(products);
    return this.markupsService.applyMarkups(discounted);
  }

  async findOne(id: string) {
    const product = await this.prisma.product.findUnique({
      where: { id },
      include: { images: true, category: true },
    });
    if (!product) return null;
    const discounted = await this.discountsService.applyDiscounts([product]);
    const marked = await this.markupsService.applyMarkups(discounted);
    return marked[0];
  }

  async create(data: any) {
    const { images, ...productData } = data;
    return this.prisma.product.create({
      data: {
        ...productData,
        slug: productData.name.toLowerCase().replace(/\s+/g, '-') + '-' + Date.now(),
        images: images ? { create: images.map((img: any) => ({ url: img.url, name: img.name })) } : undefined,
      },
      include: { images: true },
    });
  }

  async update(id: string, data: any) {
    const { images, ...productData } = data;
    if (images) {
      await this.prisma.productImage.deleteMany({ where: { productId: id } });
      return this.prisma.product.update({
        where: { id },
        data: {
          ...productData,
          images: { create: images.map((img: any) => ({ url: img.url, name: img.name })) },
        },
        include: { images: true },
      });
    }
    return this.prisma.product.update({
      where: { id },
      data: productData,
      include: { images: true },
    });
  }

  async remove(id: string) {
    return this.prisma.product.delete({ where: { id } });
  }
}
