import { BadRequestException, ConflictException, Inject, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { printOrderInclude } from '../custom-print/custom-print.service';

const createFields = ['customerName', 'userId', 'amount', 'status', 'items', 'itemsJson', 'locationJson', 'paymentMethod'];
@Injectable()
export class OrdersService {
  constructor(@Inject(PrismaService) private prisma: PrismaService) {}
  findAll() { return this.prisma.order.findMany({ include: printOrderInclude, orderBy: { createdAt: 'desc' } }); }
  findByUser(userId: string) { return this.prisma.order.findMany({ where: { userId }, include: printOrderInclude, orderBy: { createdAt: 'desc' } }); }
  async create(data: any) {
    this.checkFields(data, createFields);
    if (data.paymentMethod === 'test') throw new BadRequestException('Test orders must use the custom-print payment endpoint');
    return this.prisma.order.create({ data });
  }
  async update(id: string, data: any) {
    this.checkFields(data, createFields);
    return this.prisma.$transaction(async tx => {
      await tx.$queryRaw`SELECT "id" FROM "Order" WHERE "id" = ${id} FOR UPDATE`;
      const order = await tx.order.findUnique({ where: { id }, include: printOrderInclude });
      if (!order) throw new NotFoundException();
      const print = order.customPrintRequest;
      if (print) {
        if (Object.keys(data).some(key => key !== 'status')) throw new BadRequestException('Print order details and amount are immutable');
        if (!data.status || data.status === order.status) return order;
        const next: Record<string, string[]> = { PROCESSING: ['READY', 'CANCELLED'], READY: ['SHIPPED', 'CANCELLED'], SHIPPED: ['DELIVERED'], DELIVERED: [], CANCELLED: [] };
        if (!next[order.status]?.includes(data.status)) throw new ConflictException('Invalid print order status transition');
        if (data.status === 'CANCELLED') {
          await tx.product.update({ where: { id: JSON.parse(order.itemsJson!)[0].id }, data: { stock: { increment: print.quantity } } });
        }
      } else if (data.status && !['SHIPPED', 'DELIVERED'].includes(order.status) && ['SHIPPED', 'DELIVERED'].includes(data.status)) {
        const items = order.itemsJson ? JSON.parse(order.itemsJson) : [];
        for (const item of items) {
          if (!Number.isInteger(item.quantity) || item.quantity < 1) throw new BadRequestException('Invalid order quantity');
          const result = await tx.product.updateMany({ where: { id: item.id, stock: { gte: item.quantity } }, data: { stock: { decrement: item.quantity } } });
          if (!result.count) throw new ConflictException('Insufficient stock');
        }
      }
      const result = await tx.order.update({ where: { id }, data, include: printOrderInclude });
      if (print && data.status && order.userId) await tx.notification.create({ data: { userId: order.userId, title: 'وضعیت سفارش چاپ', message: `وضعیت سفارش ${order.id.slice(0, 8)}: ${data.status}`, type: 'order' } });
      return result;
    });
  }
  async remove(id: string) {
    // Linked orders must remain available for payment idempotency and stock accounting.
    const order = await this.prisma.order.findUnique({ where: { id }, include: printOrderInclude });
    if (order?.customPrintRequest) throw new ConflictException('Cancel a print order instead of deleting it');
    return this.prisma.order.delete({ where: { id } });
  }
  private checkFields(data: any, allowed: string[]) {
    if (!data || typeof data !== 'object' || Array.isArray(data) || Object.keys(data).some(key => !allowed.includes(key))) throw new BadRequestException('Unknown order fields');
  }
}
