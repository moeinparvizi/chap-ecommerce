import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class CustomersService {
  constructor(private prisma: PrismaService) {}

  async findAll() {
    const users = await this.prisma.user.findMany({
      orderBy: { createdAt: 'desc' },
    });
    // Enrich with order stats
    const enriched = await Promise.all(users.map(async (u) => {
      const orderCount = await this.prisma.order.count({ where: { customerName: u.name } });
      const orderSum = await this.prisma.order.aggregate({ where: { customerName: u.name }, _sum: { amount: true } });
      return {
        ...u,
        orders: orderCount,
        totalSpent: orderSum._sum.amount || 0,
      };
    }));
    return enriched;
  }

  async create(data: any) {
    return this.prisma.user.create({ data });
  }

  async update(id: string, data: any) {
    return this.prisma.user.update({ where: { id }, data });
  }

  async remove(id: string) {
    return this.prisma.user.delete({ where: { id } });
  }
}
