import 'reflect-metadata';
import { afterAll, afterEach, beforeAll, describe, expect, it } from 'vitest';
import { PrismaClient } from '@ecommerce/db';
import { execFileSync } from 'node:child_process';
import { resolve } from 'node:path';
import { randomUUID } from 'node:crypto';
import { CustomPrintService } from '../src/custom-print/custom-print.service';
import { UploadsService } from '../src/custom-print/uploads.service';
import { OrdersService } from '../src/orders/orders.service';

const target = process.env.CUSTOM_PRINT_TEST_DATABASE_URL;
const schema = `print_test_${randomUUID().replaceAll('-', '')}`;
const dbSuite = target ? describe : describe.skip;
dbSuite('custom printing with isolated PostgreSQL records', () => {
  let db: PrismaClient;
  let service: CustomPrintService;
  let uploads: UploadsService;
  let orders: OrdersService;
  let customer: any, admin: any, other: any, product: any, mug: any, location: any;
  const config = { get: (key: string) => (key === 'PAYMENT_TEST_MODE' ? 'true' : undefined) };
  beforeAll(async () => {
    const url = new URL(target!);
    url.searchParams.set('schema', schema);
    execFileSync('pnpm', ['exec', 'prisma', 'db', 'push', '--skip-generate'], {
      cwd: resolve(__dirname, '../../../packages/db'),
      env: { ...process.env, DATABASE_URL: url.toString() },
      stdio: 'pipe',
    });
    db = new PrismaClient({ datasources: { db: { url: url.toString() } } });
    service = new CustomPrintService(db as any, config as any);
    uploads = new UploadsService(db as any);
    orders = new OrdersService(db as any);
    customer = await db.user.create({
      data: {
        email: 'customer@test.invalid',
        name: 'Test customer',
        password: 'unusable',
        role: 'CUSTOMER',
      },
    });
    other = await db.user.create({
      data: { email: 'other@test.invalid', name: 'Other customer', password: 'unusable' },
    });
    admin = await db.user.create({
      data: { email: 'admin@test.invalid', name: 'Manager', password: 'unusable', role: 'ADMIN' },
    });
    product = await db.product.create({
      data: {
        name: 'Test shirt',
        sku: 'shirt',
        slug: 'shirt',
        price: 100,
        status: 'ACTIVE',
        stock: 8,
      },
    });
    mug = await db.product.create({
      data: { name: 'Test mug', sku: 'mug', slug: 'mug', price: 100, status: 'ACTIVE', stock: 8 },
    });
    location = await db.location.create({
      data: { userId: customer.id, title: 'Test', address: 'Test address', city: 'Tehran' },
    });
    await service.configure({
      productId: product.id,
      type: 'TSHIRT',
      positions: ['front', 'back'],
      enabled: true,
    });
    await service.configure({
      productId: mug.id,
      type: 'MUG',
      positions: ['ignored'],
      enabled: true,
    });
  }, 60000);
  afterEach(async () => {
    await db?.printUpload.deleteMany({ where: { request: null } });
  });
  afterAll(async () => {
    if (db) {
      await db.$executeRawUnsafe(`DROP SCHEMA "${schema}" CASCADE`);
      await db.$disconnect();
    }
  });
  async function artwork() {
    const bytes = Buffer.from([137, 80, 78, 71, 13, 10, 26, 10, 0, 0, 0, 0]);
    const file = await uploads.start(customer.id, {
      filename: 'test.png',
      mimeType: 'image/png',
      size: bytes.length,
    });
    await uploads.part(customer.id, file.id, 0, bytes.toString('base64'));
    return uploads.complete(customer.id, file.id);
  }
  async function submit(overrides = {}) {
    return service.create(customer, {
      productId: product.id,
      designUploadId: (await artwork()).id,
      locationId: location.id,
      phone: '09123456789',
      quantity: 2,
      positions: ['front'],
      size: 'XL',
      color: 'white',
      ...overrides,
    });
  }
  it('lists real eligible products and normalizes mug positions', async () => {
    const list = await service.products();
    expect(list).toHaveLength(2);
    expect(list.find((p) => p.productId === mug.id)?.positions).toEqual([]);
    await expect(
      service.configure({ productId: product.id, type: 'TSHIRT', enabled: true, positions: [] }),
    ).rejects.toThrow();
  });
  it('validates garment positions and address/artwork ownership', async () => {
    await expect(submit({ positions: ['sleeve'] })).rejects.toThrow();
    await expect(submit({ positions: [] })).rejects.toThrow();
    await expect(submit({ size: '' })).rejects.toThrow();
    const loc = await db.location.create({
      data: { userId: other.id, title: 'Other', city: 'Test', address: 'Other' },
    });
    await expect(submit({ locationId: loc.id })).rejects.toThrow();
    const request = await submit();
    await expect(service.detail(other, request.id)).rejects.toThrow();
    expect(await service.requests(other)).toEqual([]);
    await expect(
      service.create(other, {
        productId: product.id,
        designUploadId: request.designUploadId,
        locationId: loc.id,
        phone: '09123456789',
        quantity: 1,
        positions: ['front'],
        size: 'S',
        color: 'white',
      }),
    ).rejects.toThrow();
  });
  it('allows mug requests without garment choices', async () => {
    const request = await submit({
      productId: mug.id,
      positions: [],
      size: undefined,
      color: undefined,
    });
    expect(request.productType).toBe('MUG');
    expect(request.positions).toEqual([]);
  });
  it('requires configured positions for OTHER products and rejects expired unattached artwork', async () => {
    await service.configure({
      productId: mug.id,
      type: 'OTHER',
      positions: ['outside'],
      enabled: true,
    });
    await expect(submit({ productId: mug.id, positions: [] })).rejects.toThrow();
    const file = await artwork();
    await db.printUpload.update({ where: { id: file.id }, data: { createdAt: new Date(0) } });
    await expect(
      submit({ productId: mug.id, positions: ['outside'], designUploadId: file.id }),
    ).rejects.toThrow();
    await service.configure({ productId: mug.id, type: 'MUG', positions: [], enabled: true });
  });
  it('requires review before payment and an enabled test mode', async () => {
    const request = await submit();
    await expect(service.payTest(customer, request.id)).rejects.toThrow();
    await expect(
      service.review(admin, request.id, { decision: 'APPROVED', quotedAmount: 0 }),
    ).rejects.toThrow();
    await service.review(admin, request.id, { decision: 'APPROVED', quotedAmount: 50000 });
    await expect(
      new CustomPrintService(db as any, { get: () => 'false' } as any).payTest(
        customer,
        request.id,
      ),
    ).rejects.toThrow();
    await expect(service.payTest(other, request.id)).rejects.toThrow();
  });
  it('requires rejection reason and keeps rejected requests unpaid', async () => {
    const request = await submit();
    await expect(
      service.review(admin, request.id, { decision: 'REJECTED', reviewNote: '' }),
    ).rejects.toThrow();
    const rejected = await service.review(admin, request.id, {
      decision: 'REJECTED',
      reviewNote: 'Print quality insufficient',
    });
    expect(rejected.status).toBe('REJECTED');
    await expect(service.payTest(customer, request.id)).rejects.toThrow();
  });
  it('snapshots configuration, contact and quoted amount; concurrent pay creates one ordinary order', async () => {
    const request = await submit();
    await service.review(admin, request.id, { decision: 'APPROVED', quotedAmount: 50000 });
    await expect(
      service.review(admin, request.id, { decision: 'APPROVED', quotedAmount: 1 }),
    ).rejects.toThrow();
    await service.configure({
      productId: product.id,
      type: 'TSHIRT',
      enabled: true,
      positions: ['back'],
    });
    const before = (await db.product.findUniqueOrThrow({ where: { id: product.id } })).stock;
    const paid = await Promise.all([
      service.payTest(customer, request.id),
      service.payTest(customer, request.id),
    ]);
    expect(paid[0].id).toBe(paid[1].id);
    expect(paid[0].amount).toBe(50000);
    expect(paid[0].paymentMethod).toBe('test');
    expect((await db.product.findUniqueOrThrow({ where: { id: product.id } })).stock).toBe(
      before - 2,
    );
    const detail = await service.detail(customer, request.id);
    expect(detail.positions).toEqual(['front']);
    expect(detail.designUpload).not.toHaveProperty('parts');
    expect(
      (await orders.findByUser(customer.id)).some(
        (o) => o.id === paid[0].id && o.customPrintRequest?.id === request.id,
      ),
    ).toBe(true);
    await expect(orders.update(paid[0].id, { amount: 1 })).rejects.toThrow();
    await expect(orders.remove(paid[0].id)).rejects.toThrow();
    await orders.update(paid[0].id, { status: 'READY' });
    await orders.update(paid[0].id, { status: 'SHIPPED' });
    await orders.update(paid[0].id, { status: 'SHIPPED' });
    await orders.update(paid[0].id, { status: 'DELIVERED' });
    expect((await db.product.findUniqueOrThrow({ where: { id: product.id } })).stock).toBe(
      before - 2,
    );
    await expect(orders.update(paid[0].id, { status: 'CANCELLED' })).rejects.toThrow();
    await service.configure({
      productId: product.id,
      type: 'TSHIRT',
      enabled: true,
      positions: ['front'],
    });
  });
  it('cancels and restores reserved stock exactly once', async () => {
    const request = await submit();
    await service.review(admin, request.id, { decision: 'APPROVED', quotedAmount: 1000 });
    const before = (await db.product.findUniqueOrThrow({ where: { id: product.id } })).stock;
    const order = await service.payTest(customer, request.id);
    await Promise.all([
      orders.update(order.id, { status: 'CANCELLED' }),
      orders.update(order.id, { status: 'CANCELLED' }),
    ]);
    expect((await db.product.findUniqueOrThrow({ where: { id: product.id } })).stock).toBe(before);
    await expect(orders.update(order.id, { status: 'SHIPPED' })).rejects.toThrow();
    expect((await service.payTest(customer, request.id)).id).toBe(order.id);
  });
  it('does not create an order or mutate approval if stock runs out', async () => {
    const request = await submit();
    await service.review(admin, request.id, { decision: 'APPROVED', quotedAmount: 1000 });
    await db.product.update({ where: { id: product.id }, data: { stock: 0 } });
    await expect(service.payTest(customer, request.id)).rejects.toThrow();
    expect((await service.detail(customer, request.id)).status).toBe('APPROVED');
    expect((await service.detail(customer, request.id)).orderId).toBeNull();
  });
  it('rejects forged print associations on generic order creation', async () => {
    await expect(
      orders.create({
        customerName: 'forged',
        amount: 1,
        customPrintRequest: { connect: { id: 'anything' } },
      }),
    ).rejects.toThrow();
  });
});
