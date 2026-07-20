import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class CommentsService {
  constructor(private prisma: PrismaService) {}

  async findAll() {
    return this.prisma.comment.findMany({ orderBy: { createdAt: 'desc' } });
  }

  async findByUser(userId: string) {
    return this.prisma.comment.findMany({ where: { userId }, orderBy: { createdAt: 'desc' } });
  }

  async findByProduct(productId: string) {
    return this.prisma.comment.findMany({ where: { productId }, orderBy: { createdAt: 'desc' } });
  }

  async create(data: any) {
    return this.prisma.comment.create({ data });
  }

  async remove(id: string) {
    return this.prisma.comment.delete({ where: { id } });
  }

  async reply(id: string, reply: string) {
    return this.prisma.comment.update({ where: { id }, data: { reply } });
  }
}
