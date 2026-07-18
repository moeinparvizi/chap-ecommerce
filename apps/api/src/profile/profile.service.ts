import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class ProfileService {
  constructor(private prisma: PrismaService) {}

  async findOne(id: string) {
    return this.prisma.user.findUnique({ where: { id }, select: { id: true, email: true, name: true, phone: true, role: true, createdAt: true } });
  }

  async update(id: string, data: any) {
    return this.prisma.user.update({ where: { id }, data, select: { id: true, email: true, name: true, phone: true, role: true, createdAt: true } });
  }
}
