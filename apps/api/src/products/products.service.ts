import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class ProductsService {
  constructor(private prisma: PrismaService) {}

  async findAll() {
    return this.prisma.product.findMany({
      include: { images: true, category: true },
      orderBy: { createdAt: 'desc' },
    });
  }

  async findOne(id: string) {
    return this.prisma.product.findUnique({
      where: { id },
      include: { images: true, category: true },
    });
  }

  async create(data: any) {
    const { images, ...productData } = data;
    return this.prisma.product.create({
      data: {
        ...productData,
        slug: productData.name.toLowerCase().replace(/\s+/g, '-'),
        images: images ? { create: images.map((img: any) => ({ url: img.url, name: img.name })) } : undefined,
      },
      include: { images: true },
    });
  }

  async update(id: string, data: any) {
    const { images, ...productData } = data;
    if (images) {
      await this.prisma.productImage.deleteMany({ where: { productId: id } });
      return this.prisma.product.update({
        where: { id },
        data: {
          ...productData,
          images: { create: images.map((img: any) => ({ url: img.url, name: img.name })) },
        },
        include: { images: true },
      });
    }
    return this.prisma.product.update({
      where: { id },
      data: productData,
      include: { images: true },
    });
  }

  async remove(id: string) {
    return this.prisma.product.delete({ where: { id } });
  }
}
