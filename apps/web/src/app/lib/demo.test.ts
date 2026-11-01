import { beforeEach, describe, expect, it } from 'vitest';
import { demoRequest, resetDemo, enterDemo } from './demo';

describe('isolated portfolio demo', () => {
  beforeEach(() => {
    localStorage.clear();
    resetDemo();
  });
  it('seeds a usable catalog with category relationships and local images', async () => {
    const products = await demoRequest('/products');
    expect(products.length).toBeGreaterThanOrEqual(12);
    expect(products.every((p: any) => p.category?.id && p.images[0].url.startsWith('/demo/'))).toBe(
      true,
    );
  });
  it('accepts only the published demo credentials', async () => {
    expect(
      (
        await demoRequest('/auth/login', {
          method: 'POST',
          body: JSON.stringify({ email: 'admin@example.com', password: 'Demo123!' }),
        })
      ).role,
    ).toBe('admin');
    expect(
      await demoRequest('/auth/login', {
        method: 'POST',
        body: JSON.stringify({ email: 'admin@example.com', password: 'wrong' }),
      }),
    ).toBeNull();
  });
  it('persists CRUD changes and resets the original dataset', async () => {
    const product = (await demoRequest('/products'))[0];
    await demoRequest(`/products/${product.id}`, {
      method: 'PUT',
      body: JSON.stringify({ name: 'Edited locally' }),
    });
    expect((await demoRequest('/products'))[0].name).toBe('Edited locally');
    resetDemo();
    expect((await demoRequest('/products'))[0].name).toBe(product.name);
  });
  it('filters account data by owner and rejects unknown endpoints', async () => {
    const orders = await demoRequest('/orders?userId=customer-demo');
    expect(orders.length).toBeGreaterThan(0);
    expect(orders.every((o: any) => o.userId === 'customer-demo')).toBe(true);
    await expect(demoRequest('/unknown')).rejects.toThrow();
  });
});

it('opens a demo session with a public account and the matching destination', async () => {
  localStorage.clear();
  expect(await enterDemo('admin')).toBe('/admin');
  expect(JSON.parse(localStorage.getItem('user')!).role).toBe('admin');
  expect(localStorage.getItem('auth_token')).toBe('auth-admin-demo');
  expect(await enterDemo('customer')).toBe('/account');
  expect(JSON.parse(localStorage.getItem('user')!).role).toBe('customer');
});
