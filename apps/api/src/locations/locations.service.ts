import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class LocationsService {
  constructor(private prisma: PrismaService) {}

  async findAll() { return this.prisma.location.findMany({ orderBy: { createdAt: 'desc' } }); }
  async findByUser(userId: string) { return this.prisma.location.findMany({ where: { userId }, orderBy: { createdAt: 'desc' } }); }
  async create(data: any) { return this.prisma.location.create({ data }); }
  async update(id: string, data: any) { return this.prisma.location.update({ where: { id }, data }); }
  async remove(id: string) { return this.prisma.location.delete({ where: { id } }); }
  async setDefault(userId: string, locationId: string) {
    await this.prisma.location.updateMany({ where: { userId }, data: { isDefault: false } });
    return this.prisma.location.update({ where: { id: locationId }, data: { isDefault: true } });
  }
}
