import React from 'react';
import { act, cleanup, fireEvent, render, screen, waitFor } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import PublicLayout from './layout';
import { api } from '@/app/lib/api';

vi.stubGlobal('React', React);
vi.mock('next/navigation', () => ({ useRouter: () => ({ push: vi.fn() }), usePathname: () => '/' }));
vi.mock('@/app/components/SmartSearch', () => ({ default: () => null }));

beforeEach(() => { localStorage.clear(); vi.stubGlobal('React', React); vi.stubEnv('NEXT_PUBLIC_DEMO_MODE', 'true'); });
afterEach(() => { cleanup(); vi.unstubAllEnvs(); vi.unstubAllGlobals(); });

describe('storefront categories', () => {
  it('shows demo categories and refreshes the menu after a category is created', async () => {
    render(<PublicLayout><div>محتوا</div></PublicLayout>);
    expect((await screen.findAllByText('موبایل')).length).toBeGreaterThan(0);

    await act(async () => { await api.createCategory({ name: 'دسته جدید', slug: 'new-category', status: 'active', parentId: null }); });
    await waitFor(() => expect(screen.getByRole('button', { name: 'دسته جدید' })).toBeTruthy());
    await act(async () => { fireEvent.click(screen.getByText('دستهبندیها')); });
    expect(screen.getAllByText('دسته جدید').length).toBeGreaterThan(0);
  });

  it('shows subcategories whose status was corrupted by the old edit form', async () => {
    await api.createCategory({ name: 'زیرمجموعه آزمایشی', slug: 'child', status: 'cat-0', parentId: 'cat-0' });
    await api.createCategory({ name: 'زیرمجموعه غیرفعال', slug: 'inactive-child', status: 'inactive', parentId: 'cat-0' });
    render(<PublicLayout><div>محتوا</div></PublicLayout>);
    await screen.findByRole('button', { name: 'موبایل' });
    await act(async () => { fireEvent.click(screen.getByText('دستهبندیها')); });
    expect(screen.getByText('زیرمجموعه آزمایشی')).toBeTruthy();
    expect(screen.queryByText('زیرمجموعه غیرفعال')).toBeNull();
  });

  it('fetches shared categories again when the mega menu opens', async () => {
    vi.stubEnv('NEXT_PUBLIC_DEMO_MODE', 'false');
    let rows: { id: string; name: string; slug: string; parentId: string | null; status: string }[] = [{ id: 'parent', name: 'دسته سرور', slug: 'server', parentId: null, status: 'active' }];
    vi.stubGlobal('fetch', vi.fn(async () => ({ ok: true, json: async () => rows })));
    render(<PublicLayout><div>محتوا</div></PublicLayout>);
    await screen.findByRole('button', { name: 'دسته سرور' });
    rows = [...rows, { id: 'child', name: 'زیردسته سرور', slug: 'server-child', parentId: 'parent', status: 'active' }];
    await act(async () => { fireEvent.click(screen.getByText('دستهبندیها')); });
    expect(await screen.findByText('زیردسته سرور')).toBeTruthy();
  });

  it('shows a loading failure instead of silently hiding the categories', async () => {
    vi.stubEnv('NEXT_PUBLIC_DEMO_MODE', 'false');
    vi.stubGlobal('fetch', vi.fn().mockRejectedValue(new Error('Offline')));
    render(<PublicLayout><div>محتوا</div></PublicLayout>);
    await act(async () => { fireEvent.click(screen.getByText('دستهبندیها')); });
    expect(await screen.findByRole('alert')).toHaveProperty('textContent', 'دریافت دسته‌بندی‌ها ناموفق بود. لطفاً دوباره تلاش کنید.');
  });
});
