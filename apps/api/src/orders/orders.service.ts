import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class OrdersService {
  constructor(private prisma: PrismaService) {}

  async findAll() {
    return this.prisma.order.findMany({ orderBy: { createdAt: 'desc' } });
  }

  async findByUser(userId: string) {
    return this.prisma.order.findMany({ where: { userId }, orderBy: { createdAt: 'desc' } });
  }

  async create(data: any) {
    return this.prisma.order.create({ data });
  }

  async update(id: string, data: any) {
    const order = await this.prisma.order.findUnique({ where: { id } });
    if (order && data.status && !['SHIPPED', 'DELIVERED'].includes(order.status) && ['SHIPPED', 'DELIVERED'].includes(data.status)) {
      // Reduce stock when status changes to SHIPPED or DELIVERED
      const items = order.itemsJson ? JSON.parse(order.itemsJson) : [];
      for (const item of items) {
        await this.prisma.product.updateMany({
          where: { id: item.id },
          data: { stock: { decrement: item.quantity } },
        });
      }
    }
    return this.prisma.order.update({ where: { id }, data });
  }

  async remove(id: string) {
    return this.prisma.order.delete({ where: { id } });
  }
}
