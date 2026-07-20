import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class WishlistService {
  constructor(private prisma: PrismaService) {}

  async findByUser(userId: string) {
    return this.prisma.wishlist.findMany({ where: { userId }, orderBy: { createdAt: 'desc' } });
  }

  async toggle(userId: string, data: any) {
    const existing = await this.prisma.wishlist.findFirst({ where: { userId, productId: data.productId } });
    if (existing) {
      await this.prisma.wishlist.delete({ where: { id: existing.id } });
      return { liked: false };
    }
    await this.prisma.wishlist.create({ data: { userId, productId: data.productId, productName: data.productName, productPrice: data.productPrice, productImage: data.productImage || '' } });
    return { liked: true };
  }

  async remove(id: string) {
    return this.prisma.wishlist.delete({ where: { id } });
  }
}
