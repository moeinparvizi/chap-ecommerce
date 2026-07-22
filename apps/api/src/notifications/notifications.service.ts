import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class NotificationsService {
  constructor(private prisma: PrismaService) {}

  async findByUser(userId: string) {
    return this.prisma.notification.findMany({ where: { userId }, orderBy: { createdAt: 'desc' } });
  }

  async create(data: { userId: string; title: string; message: string; type: string; productId?: string }) {
    return this.prisma.notification.create({ data });
  }

  async markRead(id: string) {
    return this.prisma.notification.update({ where: { id }, data: { read: true } });
  }

  async markAllRead(userId: string) {
    return this.prisma.notification.updateMany({ where: { userId, read: false }, data: { read: true } });
  }

  async remove(id: string) {
    return this.prisma.notification.delete({ where: { id } });
  }

  async checkLowStock(productId: string, productName: string, stock: number) {
    if (stock > 1) return;
    const wishlistUsers = await this.prisma.wishlist.findMany({ where: { productId }, distinct: ['userId'] });
    for (const w of wishlistUsers) {
      const existing = await this.prisma.notification.findFirst({
        where: { userId: w.userId, productId, type: 'low_stock', read: false }
      });
      if (!existing) {
        await this.create({
          userId: w.userId,
          title: 'موجودی کم شد!',
          message: `موجودی «${productName}» به ${stock} عدد رسید. اگر می‌خواهید خریداری کنید، عجله کنید!`,
          type: 'low_stock',
          productId,
        });
      }
    }
  }
}
