import {
  BadRequestException,
  ConflictException,
  ForbiddenException,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { ARTWORK_CHUNK_BYTES } from '@ecommerce/shared';
import type { Prisma, PrintUpload } from '@ecommerce/db';
import { PrismaService } from '../prisma/prisma.service';
import { StartUploadDto } from './uploads.dto';
import {
  decodeArtworkPart,
  validateArtworkSignature,
  validateUploadDeclaration,
} from './file-validation';

type Actor = { id: string; role: string };
const SESSION_LIFETIME_MS = 24 * 60 * 60 * 1000;
const MAX_PENDING_UPLOADS = 5;

@Injectable()
export class UploadsService {
  constructor(@Inject(PrismaService) private readonly prisma: PrismaService) {}

  async start(userId: string, dto: StartUploadDto) {
    validateUploadDeclaration(dto);
    return this.prisma.$transaction(async (tx) => {
      // Serialize the quota check across server instances, not just this process.
      await tx.$queryRaw`SELECT "id" FROM "User" WHERE "id" = ${userId} FOR UPDATE`;
      // Parts cascade on deletion. Any upload traffic reclaims expired orphan sessions.
      await tx.printUpload.deleteMany({
        where: { request: null, createdAt: { lt: this.expiryCutoff() } },
      });
      const pending = await tx.printUpload.count({ where: { userId, request: null } });
      if (pending >= MAX_PENDING_UPLOADS)
        throw new ConflictException('At most five unattached artwork uploads are allowed');
      const upload = await tx.printUpload.create({
        data: {
          userId,
          filename: dto.filename.trim(),
          mimeType: dto.mimeType,
          size: dto.size,
          totalChunks: Math.ceil(dto.size / ARTWORK_CHUNK_BYTES),
        },
      });
      return this.toMetadata(upload);
    });
  }

  async part(userId: string, id: string, index: number, base64: string) {
    return this.prisma.$transaction(async (tx) => {
      const upload = await this.lockOwned(tx, userId, id);
      if (upload.completed) throw new ConflictException('Completed artwork is immutable');
      const data = decodeArtworkPart(base64, this.expectedPartSize(upload, index));
      const where = { uploadId_index: { uploadId: id, index } };
      const existing = await tx.printUploadPart.findUnique({ where });
      if (existing) {
        if (!Buffer.from(existing.data).equals(data))
          throw new ConflictException('Artwork part already contains different bytes');
      } else {
        await tx.printUploadPart.create({
          data: { uploadId: id, index, data: new Uint8Array(data) },
        });
      }
      return { stored: true as const };
    });
  }

  async complete(userId: string, id: string) {
    return this.prisma.$transaction(async (tx) => {
      const upload = await this.lockOwned(tx, userId, id);
      if (upload.completed) return this.toMetadata(upload);
      const parts = await tx.printUploadPart.findMany({
        where: { uploadId: id },
        orderBy: { index: 'asc' },
      });
      if (parts.length !== upload.totalChunks)
        throw new BadRequestException('Artwork has missing parts');
      let totalSize = 0;
      for (let index = 0; index < parts.length; index++) {
        const part = parts[index];
        if (part.index !== index || part.data.length !== this.expectedPartSize(upload, index)) {
          throw new BadRequestException(
            'Artwork parts are not contiguous or have an incorrect size',
          );
        }
        totalSize += part.data.length;
      }
      if (totalSize !== upload.size)
        throw new BadRequestException('Artwork size does not match its declaration');
      validateArtworkSignature(upload.mimeType, parts[0].data);
      return this.toMetadata(
        await tx.printUpload.update({ where: { id }, data: { completed: true } }),
      );
    });
  }

  async metadata(actor: Actor, id: string) {
    return this.toMetadata(await this.readableUpload(actor, id));
  }

  async downloadPart(actor: Actor, id: string, index: number) {
    const upload = await this.readableUpload(actor, id);
    if (!upload.completed) throw new ConflictException('Artwork upload is not complete');
    this.expectedPartSize(upload, index);
    const part = await this.prisma.printUploadPart.findUnique({
      where: { uploadId_index: { uploadId: id, index } },
    });
    if (!part) throw new NotFoundException('Artwork part not found');
    return { base64: Buffer.from(part.data).toString('base64') };
  }

  private async lockOwned(tx: Prisma.TransactionClient, userId: string, id: string) {
    await tx.$queryRaw`SELECT "id" FROM "PrintUpload" WHERE "id" = ${id} FOR UPDATE`;
    const upload = await tx.printUpload.findUnique({
      where: { id },
      include: { request: { select: { id: true } } },
    });
    this.requireLive(upload);
    if (upload.userId !== userId)
      throw new ForbiddenException('Artwork belongs to another customer');
    return upload;
  }

  private async readableUpload(actor: Actor, id: string) {
    const upload = await this.prisma.printUpload.findUnique({
      where: { id },
      include: { request: { select: { id: true } } },
    });
    this.requireLive(upload);
    const role = actor.role.toLowerCase().replace(/_/g, '');
    const isAdmin = role === 'admin' || role === 'superadmin';
    if (upload.userId !== actor.id && !(isAdmin && upload.completed)) {
      throw new ForbiddenException('Artwork belongs to another customer');
    }
    return upload;
  }

  private requireLive(
    upload: (PrintUpload & { request?: { id: string } | null }) | null,
  ): asserts upload is PrintUpload & { request?: { id: string } | null } {
    if (!upload || (!upload.request && upload.createdAt < this.expiryCutoff())) {
      throw new NotFoundException('Artwork upload not found or expired');
    }
  }

  private expectedPartSize(upload: PrintUpload, index: number) {
    if (!Number.isInteger(index) || index < 0 || index >= upload.totalChunks) {
      throw new BadRequestException('Invalid artwork part index');
    }
    return Math.min(ARTWORK_CHUNK_BYTES, upload.size - index * ARTWORK_CHUNK_BYTES);
  }

  private expiryCutoff() {
    return new Date(Date.now() - SESSION_LIFETIME_MS);
  }

  private toMetadata(upload: PrintUpload) {
    return {
      id: upload.id,
      filename: upload.filename,
      mimeType: upload.mimeType,
      size: upload.size,
      totalChunks: upload.totalChunks,
      completed: upload.completed,
    };
  }
}
