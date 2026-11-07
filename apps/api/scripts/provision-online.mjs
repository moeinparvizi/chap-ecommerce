import { PrismaClient } from '@ecommerce/db';
import { hash } from 'bcryptjs';
import { randomBytes } from 'node:crypto';
import { mkdir, writeFile, unlink } from 'node:fs/promises';
import { resolve } from 'node:path';

// Run manually after schema deployment. Never prints connection strings or passwords.
const targetUrl = process.env.DATABASE_URL;
if (!targetUrl) throw new Error('DATABASE_URL is required');
const target = new PrismaClient({ datasourceUrl: targetUrl });
let source;
try {
  if (process.env.SOURCE_DATABASE_URL) {
    if (process.env.SOURCE_DATABASE_URL === targetUrl) throw new Error('Source and target must differ');
    source = new PrismaClient({ datasourceUrl: process.env.SOURCE_DATABASE_URL });
    const [categories, products, images] = await Promise.all([
      source.category.findMany(), source.product.findMany(), source.productImage.findMany(),
    ]);
    await target.$transaction(async tx => {
      await tx.category.createMany({ data: categories, skipDuplicates: true });
      await tx.product.createMany({ data: products, skipDuplicates: true });
      await tx.productImage.createMany({ data: images, skipDuplicates: true });
    });
    console.log(`Catalog copied: ${categories.length} categories, ${products.length} products, ${images.length} images. No customer data copied.`);
  }
  const email = process.env.ONLINE_ADMIN_EMAIL;
  if (email && !(await target.user.findUnique({ where: { email } }))) {
    const password = randomBytes(24).toString('base64url');
    const directory = resolve(import.meta.dirname, '../../../tmp');
    await mkdir(directory, { recursive: true, mode: 0o700 });
    await writeFile(resolve(directory, 'online-admin.txt'), `Email: ${email}\nPassword: ${password}\n`, { mode: 0o600, flag: 'wx' });
    try {
      await target.user.create({ data: { email, name: 'مدیر فروشگاه', role: 'SUPER_ADMIN', password: await hash(password, 12) } });
    } catch (error) {
      await unlink(resolve(directory, 'online-admin.txt'));
      throw error;
    }
    console.log('Administrator created; credentials saved privately in tmp/online-admin.txt.');
  }
  console.log(`Target database: ${await target.category.count()} categories.`);
} finally {
  await source?.$disconnect();
  await target.$disconnect();
}
