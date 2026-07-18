import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class DiscountsService {
  constructor(private prisma: PrismaService) {}

  async findAll() { return this.prisma.discount.findMany({ orderBy: { createdAt: 'desc' } }); }

  async create(data: any) { return this.prisma.discount.create({ data }); }

  async update(id: string, data: any) { return this.prisma.discount.update({ where: { id }, data }); }

  async remove(id: string) { return this.prisma.discount.delete({ where: { id } }); }

  async applyDiscounts(products: any[]) {
    const activeDiscounts = await this.prisma.discount.findMany({ where: { active: true } });
    return products.map(product => {
      let discountPercentage = 0;
      for (const d of activeDiscounts) {
        if (d.targetType === 'all') { discountPercentage = Math.max(discountPercentage, d.percentage); }
        else if (d.targetType === 'product' && d.targetId === product.id) { discountPercentage = Math.max(discountPercentage, d.percentage); }
        else if (d.targetType === 'category' && d.targetId === product.categoryId) { discountPercentage = Math.max(discountPercentage, d.percentage); }
      }
      if (discountPercentage > 0) {
        const originalPrice = product.price;
        const discountedPrice = Math.round(originalPrice * (1 - discountPercentage / 100));
        return { ...product, compareAtPrice: originalPrice, price: discountedPrice, discountPercentage };
      }
      return product;
    });
  }
}
