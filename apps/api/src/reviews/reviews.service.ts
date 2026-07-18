import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class ReviewsService {
  constructor(private prisma: PrismaService) {}

  async findAll() { return this.prisma.review.findMany({ orderBy: { createdAt: 'desc' } }); }
  async findByUser(userId: string) { return this.prisma.review.findMany({ where: { userId }, orderBy: { createdAt: 'desc' } }); }
  async findByProduct(productId: string) { return this.prisma.review.findMany({ where: { productId }, orderBy: { createdAt: 'desc' } }); }
  async create(data: any) { return this.prisma.review.create({ data }); }
  async remove(id: string) { return this.prisma.review.delete({ where: { id } }); }
}
