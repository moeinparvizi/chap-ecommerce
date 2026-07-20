import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class MarkupsService {
  constructor(private prisma: PrismaService) {}

  async findAll() { return this.prisma.hiddenMarkup.findMany({ orderBy: { createdAt: 'desc' } }); }

  async create(data: any) { return this.prisma.hiddenMarkup.create({ data }); }

  async update(id: string, data: any) { return this.prisma.hiddenMarkup.update({ where: { id }, data }); }

  async remove(id: string) { return this.prisma.hiddenMarkup.delete({ where: { id } }); }

  async applyMarkups(products: any[]) {
    const activeMarkups = await this.prisma.hiddenMarkup.findMany({ where: { active: true } });
    return products.map(product => {
      let markupPercentage = 0;
      for (const m of activeMarkups) {
        if (m.targetType === 'all') { markupPercentage = Math.max(markupPercentage, m.percentage); }
        else if (m.targetType === 'product' && m.targetId === product.id) { markupPercentage = Math.max(markupPercentage, m.percentage); }
        else if (m.targetType === 'category' && m.targetId === product.categoryId) { markupPercentage = Math.max(markupPercentage, m.percentage); }
      }
      if (markupPercentage > 0) {
        const newPrice = Math.round(product.price * (1 + markupPercentage / 100));
        return { ...product, price: newPrice, hiddenMarkup: markupPercentage };
      }
      return product;
    });
  }
}
