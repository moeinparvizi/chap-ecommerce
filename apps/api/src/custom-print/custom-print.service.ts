import {
  BadRequestException,
  ConflictException,
  ForbiddenException,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ARTWORK_CHUNK_BYTES, MAX_ARTWORK_BYTES } from '@ecommerce/shared';
import { PrismaService } from '../prisma/prisma.service';
import {
  CreatePrintRequestDto,
  PrintConfigurationDto,
  ReviewPrintRequestDto,
} from './custom-print.dto';

export type PrintActor = { id: string; role: string; name?: string };
export const isPrintAdmin = (actor: PrintActor) => ['ADMIN', 'SUPER_ADMIN'].includes(actor.role);
const uploadSelect = {
  id: true,
  filename: true,
  mimeType: true,
  size: true,
  totalChunks: true,
  completed: true,
} as const;
const requestInclude = {
  designUpload: { select: uploadSelect },
  order: { select: { id: true, status: true, amount: true, paymentMethod: true } },
} as const;
export const printOrderInclude = {
  customPrintRequest: {
    select: {
      id: true,
      productName: true,
      productType: true,
      quantity: true,
      positions: true,
      size: true,
      color: true,
      notes: true,
      phone: true,
      locationJson: true,
      designUploadId: true,
    },
  },
} as const;
@Injectable()
export class CustomPrintService {
  constructor(
    @Inject(PrismaService) private readonly prisma: PrismaService,
    @Inject(ConfigService) private readonly config: ConfigService,
  ) {}
  settings() {
    return {
      testPaymentEnabled: this.config.get('PAYMENT_TEST_MODE') === 'true',
      maxUploadBytes: MAX_ARTWORK_BYTES,
      chunkBytes: ARTWORK_CHUNK_BYTES,
    };
  }
  products() {
    return this.prisma.printProduct.findMany({
      where: { enabled: true, product: { status: 'ACTIVE' } },
      include: { product: { include: { images: true } } },
      orderBy: { createdAt: 'asc' },
    });
  }
  configurations() {
    return this.prisma.printProduct.findMany({
      include: { product: { include: { images: true } } },
      orderBy: { createdAt: 'desc' },
    });
  }
  async configure(dto: PrintConfigurationDto) {
    if (!['TSHIRT', 'PANTS', 'MUG', 'OTHER'].includes(dto.type))
      throw new BadRequestException('نوع محصول معتبر نیست');
    const positions =
      dto.type === 'MUG' ? [] : [...new Set(dto.positions.map((p) => p.trim()).filter(Boolean))];
    if (['TSHIRT', 'PANTS'].includes(dto.type) && !positions.length)
      throw new BadRequestException('محل چاپ پوشاک را مشخص کنید');
    if (!(await this.prisma.product.findUnique({ where: { id: dto.productId } })))
      throw new NotFoundException('محصول پیدا نشد');
    const data = { type: dto.type, enabled: dto.enabled, positions };
    return this.prisma.printProduct.upsert({
      where: { productId: dto.productId },
      create: { productId: dto.productId, ...data },
      update: data,
      include: { product: { include: { images: true } } },
    });
  }
  requests(actor: PrintActor) {
    return this.prisma.customPrintRequest.findMany({
      where: isPrintAdmin(actor) ? {} : { userId: actor.id },
      include: requestInclude,
      orderBy: { createdAt: 'desc' },
    });
  }
  async detail(actor: PrintActor, id: string) {
    const request = await this.prisma.customPrintRequest.findUnique({
      where: { id },
      include: requestInclude,
    });
    if (!request) throw new NotFoundException('درخواست پیدا نشد');
    if (request.userId !== actor.id && !isPrintAdmin(actor)) throw new ForbiddenException();
    return request;
  }
  async create(actor: PrintActor, dto: CreatePrintRequestDto) {
    if (!Number.isInteger(dto.quantity) || dto.quantity < 1 || dto.quantity > 100)
      throw new BadRequestException('تعداد معتبر نیست');
    if (!/^\+?[0-9]{10,15}$/.test(dto.phone))
      throw new BadRequestException('شماره تماس معتبر نیست');
    return this.prisma.$transaction(async (tx) => {
      // Keep artwork reusable after a failed request, but allow only one successful attachment.
      await tx.$queryRaw`SELECT "id" FROM "PrintUpload" WHERE "id" = ${dto.designUploadId} FOR UPDATE`;
      const [configuration, upload, location, customer] = await Promise.all([
        tx.printProduct.findUnique({
          where: { productId: dto.productId },
          include: { product: { include: { images: true } } },
        }),
        tx.printUpload.findUnique({
          where: { id: dto.designUploadId },
          include: { request: { select: { id: true } } },
        }),
        tx.location.findUnique({ where: { id: dto.locationId } }),
        tx.user.findUnique({ where: { id: actor.id }, select: { name: true } }),
      ]);
      if (
        !configuration?.enabled ||
        configuration.product.status !== 'ACTIVE' ||
        configuration.product.stock < dto.quantity
      )
        throw new BadRequestException('محصول فعال نیست یا موجودی کافی نیست');
      if (
        !upload ||
        upload.userId !== actor.id ||
        !upload.completed ||
        upload.request ||
        upload.createdAt < new Date(Date.now() - 24 * 60 * 60 * 1000)
      )
        throw new BadRequestException('طرح معتبر نیست یا قبلاً استفاده شده است');
      if (!location || location.userId !== actor.id)
        throw new BadRequestException('آدرس متعلق به شما نیست');
      if (!customer) throw new ForbiddenException();
      const garment = ['TSHIRT', 'PANTS'].includes(configuration.type);
      const positions = dto.positions;
      if (
        new Set(positions).size !== positions.length ||
        positions.some((p) => !configuration.positions.includes(p)) ||
        (configuration.positions.length > 0 && !positions.length)
      )
        throw new BadRequestException('محل چاپ را از گزینه‌های مجاز انتخاب کنید');
      if (garment && (!dto.size?.trim() || !dto.color?.trim()))
        throw new BadRequestException('سایز و رنگ پوشاک را مشخص کنید');
      const request = await tx.customPrintRequest.create({
        data: {
          userId: actor.id,
          customerName: customer.name,
          productId: configuration.productId,
          productName: configuration.product.name,
          productImage: configuration.product.images[0]?.url,
          productType: configuration.type,
          quantity: dto.quantity,
          positions,
          size: dto.size?.trim(),
          color: dto.color?.trim(),
          notes: dto.notes?.trim(),
          phone: dto.phone,
          locationJson: JSON.stringify({
            title: location.title,
            address: location.address,
            city: location.city,
            postalCode: location.postalCode,
            phone: dto.phone,
          }),
          designUploadId: upload.id,
        },
        include: requestInclude,
      });
      const admins = await tx.user.findMany({
        where: { role: { in: ['ADMIN', 'SUPER_ADMIN'] } },
        select: { id: true },
      });
      await tx.notification.createMany({
        data: admins.map((user) => ({
          userId: user.id,
          title: 'درخواست چاپ جدید',
          message: `${customer.name}: ${configuration.product.name}`,
          type: 'custom-print',
        })),
      });
      return request;
    });
  }
  async review(actor: PrintActor, id: string, dto: ReviewPrintRequestDto) {
    if (!isPrintAdmin(actor)) throw new ForbiddenException();
    if (!['APPROVED', 'REJECTED'].includes(dto.decision)) throw new BadRequestException();
    if (
      dto.decision === 'APPROVED' &&
      (!Number.isFinite(dto.quotedAmount) ||
        dto.quotedAmount! <= 0 ||
        dto.quotedAmount! > 1000000000)
    )
      throw new BadRequestException('مبلغ نهایی معتبر لازم است');
    if (dto.decision === 'REJECTED' && !dto.reviewNote?.trim())
      throw new BadRequestException('دلیل رد را وارد کنید');
    return this.prisma.$transaction(async (tx) => {
      await tx.$queryRaw`SELECT "id" FROM "CustomPrintRequest" WHERE "id" = ${id} FOR UPDATE`;
      const request = await tx.customPrintRequest.findUnique({ where: { id } });
      if (!request) throw new NotFoundException();
      if (request.status !== 'PENDING_REVIEW')
        throw new ConflictException('این درخواست قبلاً بررسی شده است');
      const result = await tx.customPrintRequest.update({
        where: { id },
        data: {
          status: dto.decision,
          quotedAmount: dto.decision === 'APPROVED' ? dto.quotedAmount : null,
          reviewNote: dto.reviewNote?.trim(),
          reviewerId: actor.id,
        },
        include: requestInclude,
      });
      await tx.notification.create({
        data: {
          userId: request.userId,
          title: 'نتیجه بررسی طرح چاپ',
          message:
            dto.decision === 'APPROVED'
              ? `طرح تأیید شد؛ مبلغ کل ${dto.quotedAmount} تومان. پرداخت این نسخه آزمایشی است.`
              : `طرح رد شد: ${dto.reviewNote?.trim()}`,
          type: 'custom-print',
        },
      });
      return result;
    });
  }
  async payTest(actor: PrintActor, id: string) {
    if (!this.settings().testPaymentEnabled)
      throw new ForbiddenException('پرداخت آزمایشی در این محیط فعال نیست');
    return this.prisma.$transaction(async (tx) => {
      await tx.$queryRaw`SELECT "id" FROM "CustomPrintRequest" WHERE "id" = ${id} FOR UPDATE`;
      const request = await tx.customPrintRequest.findUnique({ where: { id } });
      if (!request) throw new NotFoundException();
      if (request.userId !== actor.id) throw new ForbiddenException();
      if (request.status === 'PAID' && request.orderId)
        return tx.order.findUniqueOrThrow({
          where: { id: request.orderId },
          include: printOrderInclude,
        });
      if (request.status !== 'APPROVED' || !request.quotedAmount)
        throw new ConflictException('ابتدا طرح و مبلغ نهایی باید تأیید شود');
      const stock = await tx.product.updateMany({
        where: { id: request.productId, status: 'ACTIVE', stock: { gte: request.quantity } },
        data: { stock: { decrement: request.quantity } },
      });
      if (stock.count !== 1)
        throw new ConflictException('موجودی کافی نیست؛ با فروشگاه تماس بگیرید');
      const order = await tx.order.create({
        data: {
          userId: actor.id,
          customerName: request.customerName,
          amount: request.quotedAmount,
          status: 'PROCESSING',
          paymentMethod: 'test',
          items: request.quantity,
          locationJson: request.locationJson,
          itemsJson: JSON.stringify([
            {
              id: request.productId,
              name: request.productName,
              image: request.productImage,
              quantity: request.quantity,
              price: request.quotedAmount / request.quantity,
              customPrintRequestId: request.id,
            },
          ]),
        },
      });
      await tx.customPrintRequest.update({
        where: { id },
        data: { status: 'PAID', orderId: order.id },
      });
      await tx.notification.create({
        data: {
          userId: actor.id,
          title: 'سفارش چاپ ثبت شد',
          message: 'پرداخت آزمایشی ثبت شد؛ بدون برداشت وجه. سفارش در حال آماده‌سازی است.',
          type: 'order',
        },
      });
      return tx.order.findUniqueOrThrow({ where: { id: order.id }, include: printOrderInclude });
    });
  }
}
