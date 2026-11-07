import { describe, it, expect, vi } from 'vitest';
import { JwtService } from '@nestjs/jwt';
import { hash, compare } from 'bcryptjs';
import { AuthService } from '../src/auth/auth.service';
import { AccessGuard } from '../src/auth/access.guard';

const jwt = new JwtService({ secret: 'test-secret-with-at-least-thirty-two-characters', signOptions: { expiresIn: '1h' } });
const user = { id: 'admin-id', email: 'admin@test.invalid', name: 'Admin', password: '', role: 'ADMIN', phone: null };
const context = (method: string, path: string, token?: string, extra = {}) => ({
  switchToHttp: () => ({ getRequest: () => ({ method, path, headers: token ? { authorization: `Bearer ${token}` } : {}, query: {}, params: {}, body: {}, ...extra }) }),
}) as any;

describe('real backend authentication', () => {
  it('returns a signed token and never the password', async () => {
    const password = await hash('StrongTestPassword!', 4);
    const prisma = { user: { findUnique: vi.fn().mockResolvedValue({ ...user, password }) } };
    const service = new AuthService(prisma as any, jwt);
    const result = await service.login(user.email, 'StrongTestPassword!');
    expect(result).not.toHaveProperty('password');
    expect((await jwt.verifyAsync(result.accessToken)).sub).toBe(user.id);
    expect(result.role).toBe('admin');
  });

  it('rejects incorrect credentials', async () => {
    const prisma = { user: { findUnique: vi.fn().mockResolvedValue({ ...user, password: await hash('correct-password', 4) }) } };
    await expect(new AuthService(prisma as any, jwt).login(user.email, 'wrong')).rejects.toThrow();
  });

  it('hashes new registrations and forces the customer role', async () => {
    const prisma = { user: { create: vi.fn(async ({ data }) => ({ id: 'new-user', ...data })) } };
    const result = await new AuthService(prisma as any, jwt).register({ email: 'new@test.invalid', name: 'New', password: 'StrongTestPassword!' });
    const stored = prisma.user.create.mock.calls[0][0].data;
    expect(stored.role).toBe('CUSTOMER');
    expect(await compare('StrongTestPassword!', stored.password)).toBe(true);
    expect(result).not.toHaveProperty('password');
  });
});

describe('backend category permissions', () => {
  const prisma = { user: { findUnique: vi.fn() }, location: { findUnique: vi.fn() } };
  const guard = () => new AccessGuard(jwt, prisma as any);

  it('lets customers read categories without a token', async () => {
    expect(await guard().canActivate(context('GET', '/api/categories'))).toBe(true);
  });
  it('rejects anonymous category writes', async () => {
    await expect(guard().canActivate(context('POST', '/api/categories'))).rejects.toThrow();
  });
  it.each(['ADMIN', 'SUPER_ADMIN'])('allows category writes for %s', async (role) => {
    prisma.user.findUnique.mockResolvedValue({ ...user, role });
    expect(await guard().canActivate(context('POST', '/api/categories', await jwt.signAsync({ sub: user.id })))).toBe(true);
  });
  it('rejects category writes by customers', async () => {
    prisma.user.findUnique.mockResolvedValue({ ...user, role: 'CUSTOMER' });
    await expect(guard().canActivate(context('POST', '/api/categories', await jwt.signAsync({ sub: user.id })))).rejects.toThrow();
  });
  it('rejects forged and expired tokens', async () => {
    await expect(guard().canActivate(context('POST', '/api/categories', 'auth-admin-id'))).rejects.toThrow();
    const expired = await jwt.signAsync({ sub: user.id }, { expiresIn: -1 });
    await expect(guard().canActivate(context('POST', '/api/categories', expired))).rejects.toThrow();
  });
  it('prevents a customer changing another customer’s address', async () => {
    prisma.user.findUnique.mockResolvedValue({ ...user, role: 'CUSTOMER' });
    prisma.location.findUnique.mockResolvedValue({ userId: 'other-user' });
    await expect(guard().canActivate(context('PUT', '/api/locations/location-id', await jwt.signAsync({ sub: user.id })))).rejects.toThrow();
  });
});

describe('custom print route access', () => {
  const customer = { id: 'customer', role: 'CUSTOMER', name: 'Customer' };
  const guard = new AccessGuard(jwt, { user: { findUnique: async () => customer } } as any);
  it('allows public settings and product discovery', async () => {
    expect(await guard.canActivate(context('GET', '/api/custom-print/settings'))).toBe(true);
    expect(await guard.canActivate(context('GET', '/api/custom-print/products'))).toBe(true);
  });
  it('requires login for artwork and customer requests', async () => {
    await expect(guard.canActivate(context('GET', '/api/custom-print/requests'))).rejects.toThrow();
    await expect(guard.canActivate(context('POST', '/api/custom-print/uploads'))).rejects.toThrow();
  });
  it('allows authenticated customer routes but denies admin configuration and review', async () => {
    const token = await jwt.signAsync({ sub: customer.id });
    expect(await guard.canActivate(context('POST', '/api/custom-print/requests', token))).toBe(true);
    expect(await guard.canActivate(context('POST', '/api/custom-print/requests/id/pay-test', token))).toBe(true);
    await expect(guard.canActivate(context('POST', '/api/custom-print/configurations', token))).rejects.toThrow();
    await expect(guard.canActivate(context('POST', '/api/custom-print/requests/id/review', token))).rejects.toThrow();
  });
});
