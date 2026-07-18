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
    return this.prisma.order.update({ where: { id }, data });
  }

  async remove(id: string) {
    return this.prisma.order.delete({ where: { id } });
  }
}
