import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { hash } from 'bcryptjs';

const publicFields = { id: true, email: true, name: true, role: true, phone: true, avatar: true, createdAt: true, updatedAt: true } as const;

@Injectable()
export class CustomersService {
  constructor(private prisma: PrismaService) {}

  async findAll() {
    const users = await this.prisma.user.findMany({
      select: publicFields,
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
    return this.prisma.user.create({ data: {
      email: data.email, name: data.name, password: await hash(data.password, 12), role: data.role || 'CUSTOMER', phone: data.phone,
    }, select: publicFields });
  }

  async update(id: string, data: any) {
    return this.prisma.user.update({ where: { id }, data: {
      email: data.email, name: data.name, phone: data.phone, role: data.role,
      ...(data.password ? { password: await hash(data.password, 12) } : {}),
    }, select: publicFields });
  }

  async remove(id: string) {
    return this.prisma.user.delete({ where: { id }, select: publicFields });
  }
}
