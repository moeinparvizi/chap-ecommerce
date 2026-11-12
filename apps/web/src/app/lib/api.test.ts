import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

beforeEach(() => { vi.resetModules(); localStorage.clear(); vi.stubEnv('NEXT_PUBLIC_DEMO_MODE', 'false'); vi.stubEnv('NEXT_PUBLIC_API_URL', ''); });
afterEach(() => { vi.unstubAllEnvs(); vi.unstubAllGlobals(); });

describe('shared backend transport', () => {
  it('reads categories through the same-origin API', async () => {
    const fetch = vi.fn().mockResolvedValue({ ok: true, json: async () => [] });
    vi.stubGlobal('fetch', fetch);
    const { api } = await import('./api');
    await api.getCategories();
    expect(fetch.mock.calls[0][0]).toBe('/api/categories');
  });
  it('sends signed credentials and parentId when creating a subcategory', async () => {
    localStorage.setItem('auth_token', 'signed-server-token');
    const fetch = vi.fn().mockResolvedValue({ ok: true, json: async () => ({ id: 'child' }) });
    vi.stubGlobal('fetch', fetch);
    const { api } = await import('./api');
    await api.createCategory({ name: 'زیرمجموعه', parentId: 'parent', status: 'active' });
    const [url, options] = fetch.mock.calls[0];
    expect(url).toBe('/api/categories');
    expect(options.method).toBe('POST');
    expect(new Headers(options.headers).get('Authorization')).toBe('Bearer signed-server-token');
    expect(JSON.parse(options.body).parentId).toBe('parent');
  });
  it('surfaces server errors without writing a local demo category', async () => {
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue({ ok: false, status: 403, json: async () => ({ message: 'Forbidden' }) }));
    const { api } = await import('./api');
    await expect(api.createCategory({ name: 'Rejected' })).rejects.toThrow('Forbidden');
    expect(localStorage.getItem('chap-demo-v1')).toBeNull();
  });
});

describe('browser demo session', () => {
  it('keeps demo reads and writes in the browser and resumes server requests after logout', async () => {
    const fetch = vi.fn().mockResolvedValue({ ok: true, json: async () => [] });
    vi.stubGlobal('fetch', fetch);
    const { enterDemo } = await import('./demo');
    const { api } = await import('./api');
    await enterDemo('admin');
    await api.createCategory({ name: 'نمونه' });
    expect((await api.getCategories()).some((category: { name: string }) => category.name === 'نمونه')).toBe(true);
    expect(fetch).not.toHaveBeenCalled();
    localStorage.removeItem('auth_token');
    await api.getCategories();
    expect(fetch).toHaveBeenCalledOnce();
  });
});
