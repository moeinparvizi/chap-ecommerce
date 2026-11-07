import React from 'react';
import { act, cleanup, fireEvent, render, screen } from '@testing-library/react';
import { afterEach, expect, it, vi } from 'vitest';
import CategoriesPage from './page';
import PublicLayout from '../../(public)/layout';

vi.mock('next/navigation', () => ({ useRouter: () => ({ push: vi.fn() }), usePathname: () => '/' }));
vi.mock('@/app/components/SmartSearch', () => ({ default: () => null }));
afterEach(() => { cleanup(); vi.unstubAllGlobals(); vi.unstubAllEnvs(); localStorage.clear(); });

it('posts a parent and child to the shared API and shows them for a separate customer session', async () => {
  vi.stubGlobal('React', React);
  vi.stubEnv('NEXT_PUBLIC_DEMO_MODE', 'false');
  localStorage.clear();
  localStorage.setItem('auth_token', 'signed-admin-token');
  const records: any[] = [];
  const requests: { url: string; method: string; authorization: string | null }[] = [];
  vi.stubGlobal('fetch', vi.fn(async (url: string, options: RequestInit) => {
    const method = options.method || 'GET';
    requests.push({ url, method, authorization: new Headers(options.headers).get('Authorization') });
    if (method === 'POST') {
      const record = { id: `id-${records.length}`, ...JSON.parse(String(options.body)) };
      records.push(record);
      return { ok: true, json: async () => record };
    }
    return { ok: true, json: async () => [...records] };
  }));
  render(<CategoriesPage />);
  await screen.findByText('دستهبندیای وجود ندارد');
  fireEvent.click(screen.getByText('افزودن دستهبندی'));
  fireEvent.change(document.getElementById('add-name')!, { target: { value: 'دسته مشترک' } });
  await act(async () => { fireEvent.click(screen.getByText('ذخیره')); });
  await screen.findByRole('heading', { name: 'دسته مشترک' });
  fireEvent.click(screen.getByRole('button', { name: 'ساب کتگوری' }));
  fireEvent.change(document.getElementById('add-name')!, { target: { value: 'زیردسته مشترک' } });
  await act(async () => { fireEvent.click(screen.getByText('ذخیره')); });
  await screen.findByRole('heading', { name: 'زیردسته مشترک' });
  expect(records[1].parentId).toBe(records[0].id);
  expect(requests.filter(r => r.method === 'POST')).toEqual([
    { url: '/api/categories', method: 'POST', authorization: 'Bearer signed-admin-token' },
    { url: '/api/categories', method: 'POST', authorization: 'Bearer signed-admin-token' },
  ]);

  cleanup();
  localStorage.clear();
  render(<PublicLayout><div>فروشگاه مشتری</div></PublicLayout>);
  await screen.findByRole('button', { name: 'دسته مشترک' });
  await act(async () => { fireEvent.click(screen.getByText('دستهبندیها')); });
  expect(await screen.findByText('زیردسته مشترک')).toBeTruthy();
  expect(requests.at(-1)).toEqual({ url: '/api/categories', method: 'GET', authorization: null });
});
