// HTTP smoke test against a running API and its explicitly configured database.
// Creates uniquely named fixtures, then removes only those fixtures. Never charges money.
import { PrismaClient } from '@ecommerce/db';
import { hash } from 'bcryptjs';
import { randomBytes, randomUUID, createHash } from 'node:crypto';
import assert from 'node:assert/strict';

const base = process.env.PRINT_SMOKE_API_URL;
if (!base || !process.env.DATABASE_URL)
  throw new Error('PRINT_SMOKE_API_URL and DATABASE_URL are required');
if (
  !['localhost', '127.0.0.1'].includes(new URL(base).hostname) &&
  process.env.PRINT_SMOKE_ALLOW_ONLINE !== 'true'
) {
  throw new Error('Set PRINT_SMOKE_ALLOW_ONLINE=true only for the authorized trial deployment');
}
const db = new PrismaClient({ datasourceUrl: process.env.DATABASE_URL });
const marker = `print-smoke-${randomUUID()}`;
const password = randomBytes(24).toString('base64url');
const userIds = [],
  productIds = [];
let stage = 'initialization';
async function call(path, method = 'GET', body, token, expected = method === 'POST' ? 201 : 200) {
  const res = await fetch(base.replace(/\/$/, '') + path, {
    method,
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    ...(body === undefined ? {} : { body: JSON.stringify(body) }),
    signal: AbortSignal.timeout(60000),
  });
  const data = await res.json().catch(() => null);
  assert.equal(
    res.status,
    expected,
    `${stage}: ${method} ${path} returned ${res.status}; expected ${expected}`,
  );
  return data;
}
const root = '/custom-print';
try {
  stage = 'trial mode';
  assert.equal((await call(`${root}/settings`)).testPaymentEnabled, true);
  const manager = await db.user.create({
    data: {
      email: `${marker}-admin@test.invalid`,
      name: marker,
      role: 'ADMIN',
      password: await hash(password, 10),
    },
  });
  userIds.push(manager.id);
  const admin = await call('/auth/login', 'POST', { email: manager.email, password });
  const customer = await call('/auth/register', 'POST', {
    email: `${marker}@test.invalid`,
    name: marker,
    password,
  });
  userIds.push(customer.id);
  const other = await call('/auth/register', 'POST', {
    email: `${marker}-other@test.invalid`,
    name: marker,
    password,
  });
  userIds.push(other.id);
  const token = customer.accessToken,
    adminToken = admin.accessToken;
  const location = await call(
    '/locations',
    'POST',
    {
      userId: customer.id,
      title: 'Smoke test',
      address: 'Disposable test address',
      city: 'Test',
      phone: '09123456789',
    },
    token,
  );
  stage = 'configuration and authorization';
  const products = [];
  for (const type of ['TSHIRT', 'PANTS', 'MUG']) {
    const product = await db.product.create({
      data: {
        name: `${marker}-${type}`,
        sku: `${marker}-${type}`,
        slug: `${marker}-${type}`,
        status: 'ACTIVE',
        price: 100,
        stock: 5,
      },
    });
    productIds.push(product.id);
    products.push(product);
    await call(
      `${root}/configurations`,
      'POST',
      {
        productId: product.id,
        type,
        enabled: true,
        positions: type === 'MUG' ? [] : ['front', 'back'],
      },
      adminToken,
    );
  }
  const config = { productId: products[0].id, type: 'TSHIRT', enabled: true, positions: ['front'] };
  await call(`${root}/configurations`, 'POST', config, undefined, 401);
  await call(`${root}/configurations`, 'POST', config, token, 403);
  assert.equal(
    (await call(`${root}/products`)).filter((p) => productIds.includes(p.productId)).length,
    3,
  );
  await call(
    `${root}/uploads`,
    'POST',
    { filename: 'too-big.png', mimeType: 'image/png', size: 10485761 },
    token,
    400,
  );
  await call(
    `${root}/uploads`,
    'POST',
    { filename: 'x.png', mimeType: 'image/png', size: 12, userId: other.id },
    token,
    400,
  );
  async function upload(size) {
    const bytes = Buffer.alloc(size, 65);
    Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]).copy(bytes);
    const file = await call(
      `${root}/uploads`,
      'POST',
      { filename: 'trial-artwork.png', mimeType: 'image/png', size },
      token,
    );
    for (let i = 0; i < file.totalChunks; i++) {
      const base64 = bytes
        .subarray(i * 1048576, Math.min((i + 1) * 1048576, size))
        .toString('base64');
      await call(`${root}/uploads/${file.id}/parts/${i}`, 'PUT', { base64 }, token);
    }
    await call(`${root}/uploads/${file.id}/complete`, 'POST', undefined, token);
    return { file, bytes };
  }
  stage = '10 MiB upload and private download';
  const { file, bytes } = await upload(10485760);
  await call(`${root}/uploads/${file.id}`, 'GET', undefined, undefined, 401);
  await call(`${root}/uploads/${file.id}`, 'GET', undefined, other.accessToken, 403);
  await call(`${root}/uploads/${file.id}/parts/0`, 'GET', undefined, other.accessToken, 403);
  await call(`${root}/uploads/${file.id}`, 'GET', undefined, adminToken);
  const downloaded = [];
  for (let i = 0; i < file.totalChunks; i++)
    downloaded.push(
      Buffer.from(
        (await call(`${root}/uploads/${file.id}/parts/${i}`, 'GET', undefined, token)).base64,
        'base64',
      ),
    );
  assert.equal(
    createHash('sha256').update(Buffer.concat(downloaded)).digest('hex'),
    createHash('sha256').update(bytes).digest('hex'),
  );
  const body = {
    productId: products[0].id,
    designUploadId: file.id,
    locationId: location.id,
    phone: '09123456789',
    quantity: 2,
    positions: ['front'],
    size: 'XL',
    color: 'white',
  };
  stage = 'request ownership and review';
  await call(`${root}/requests`, 'POST', { ...body, positions: [] }, token, 400);
  const print = await call(`${root}/requests`, 'POST', body, token);
  await call(`${root}/requests/${print.id}`, 'GET', undefined, other.accessToken, 403);
  await call(`${root}/requests/${print.id}/pay-test`, 'POST', undefined, token, 409);
  await call(
    `${root}/requests/${print.id}/review`,
    'POST',
    { decision: 'APPROVED', quotedAmount: 50000 },
    token,
    403,
  );
  await call(
    `${root}/requests/${print.id}/review`,
    'POST',
    { decision: 'APPROVED', quotedAmount: 50000 },
    adminToken,
  );
  stage = 'concurrent payment and ordinary order';
  const [first, retry] = await Promise.all([
    call(`${root}/requests/${print.id}/pay-test`, 'POST', undefined, token),
    call(`${root}/requests/${print.id}/pay-test`, 'POST', undefined, token),
  ]);
  assert.equal(first.id, retry.id);
  assert.equal(first.paymentMethod, 'test');
  assert.equal(first.amount, 50000);
  assert.equal((await db.product.findUniqueOrThrow({ where: { id: products[0].id } })).stock, 3);
  const mine = await call(`/orders?userId=${customer.id}`, 'GET', undefined, token);
  assert.equal(mine.find((o) => o.id === first.id)?.customPrintRequest?.id, print.id);
  assert.equal(
    (await call('/orders', 'GET', undefined, adminToken)).find((o) => o.id === first.id)
      ?.customPrintRequest?.id,
    print.id,
  );
  await call(`/orders/${first.id}`, 'PUT', { amount: 1 }, adminToken, 400);
  for (const status of ['READY', 'SHIPPED', 'SHIPPED', 'DELIVERED'])
    await call(`/orders/${first.id}`, 'PUT', { status }, adminToken);
  await call(`/orders/${first.id}`, 'PUT', { status: 'CANCELLED' }, adminToken, 409);
  assert.equal((await db.product.findUniqueOrThrow({ where: { id: products[0].id } })).stock, 3);
  stage = 'pants and mug; rejection and cancellation';
  for (const [index, decision] of [
    [1, 'APPROVED'],
    [2, 'REJECTED'],
  ]) {
    const small = await upload(12);
    const garment = index === 1;
    const request = await call(
      `${root}/requests`,
      'POST',
      {
        ...body,
        productId: products[index].id,
        designUploadId: small.file.id,
        positions: garment ? ['back'] : [],
        ...(garment ? { size: 'L', color: 'black' } : { size: undefined, color: undefined }),
      },
      token,
    );
    await call(
      `${root}/requests/${request.id}/review`,
      'POST',
      {
        decision,
        ...(decision === 'APPROVED' ? { quotedAmount: 70000 } : { reviewNote: 'Test rejection' }),
      },
      adminToken,
    );
    if (decision === 'REJECTED')
      await call(`${root}/requests/${request.id}/pay-test`, 'POST', undefined, token, 409);
    else {
      const order = await call(`${root}/requests/${request.id}/pay-test`, 'POST', undefined, token);
      await call(`/orders/${order.id}`, 'PUT', { status: 'CANCELLED' }, adminToken);
      await call(`/orders/${order.id}`, 'PUT', { status: 'CANCELLED' }, adminToken);
      assert.equal(
        (await db.product.findUniqueOrThrow({ where: { id: products[index].id } })).stock,
        5,
      );
    }
  }
  console.log(
    JSON.stringify({
      passed: true,
      transferBytes: 10485760,
      identicalDownload: true,
      privateArtwork: true,
      realHttp: true,
      shirtsAndPantsAndMugs: true,
      reviewAndRejection: true,
      concurrentPaymentSingleOrder: true,
      normalOrderLists: true,
      fulfillmentAndCancellation: true,
      noRealCharge: true,
    }),
  );
} catch (error) {
  console.error(`Custom-print smoke failed at ${stage}: ${error.message}`);
  process.exitCode = 1;
} finally {
  const requests = await db.customPrintRequest.findMany({
    where: { userId: { in: userIds } },
    select: { orderId: true },
  });
  await db.customPrintRequest.deleteMany({ where: { userId: { in: userIds } } });
  await db.order.deleteMany({
    where: { id: { in: requests.map((r) => r.orderId).filter(Boolean) } },
  });
  await db.printUpload.deleteMany({ where: { userId: { in: userIds } } });
  await db.notification.deleteMany({
    where: { OR: [{ userId: { in: userIds } }, { message: { contains: marker } }] },
  });
  await db.location.deleteMany({ where: { userId: { in: userIds } } });
  await db.user.deleteMany({ where: { id: { in: userIds } } });
  await db.product.deleteMany({ where: { id: { in: productIds } } });
  await db.$disconnect();
  console.log('Disposable fixtures removed.');
}
