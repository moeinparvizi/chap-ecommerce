import React from 'react';
import { cleanup, fireEvent, render, screen, waitFor } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import PublicLayout from './layout';
import { api } from '@/app/lib/api';

vi.stubGlobal('React', React);
vi.mock('next/navigation', () => ({ useRouter: () => ({ push: vi.fn() }), usePathname: () => '/' }));
vi.mock('@/app/components/SmartSearch', () => ({ default: () => null }));

beforeEach(() => { localStorage.clear(); vi.stubEnv('NEXT_PUBLIC_DEMO_MODE', 'true'); });
afterEach(() => { cleanup(); vi.unstubAllEnvs(); });

describe('storefront categories', () => {
  it('shows demo categories and refreshes the menu after a category is created', async () => {
    render(<PublicLayout><div>محتوا</div></PublicLayout>);
    expect((await screen.findAllByText('موبایل')).length).toBeGreaterThan(0);

    await api.createCategory({ name: 'دسته جدید', slug: 'new-category', status: 'active', parentId: null });
    await waitFor(() => expect(screen.getByRole('button', { name: 'دسته جدید' })).toBeTruthy());
    fireEvent.click(screen.getByText('دستهبندیها'));
    expect(screen.getAllByText('دسته جدید').length).toBeGreaterThan(0);
  });

  it('shows subcategories whose status was corrupted by the old edit form', async () => {
    await api.createCategory({ name: 'زیرمجموعه آزمایشی', slug: 'child', status: 'cat-0', parentId: 'cat-0' });
    await api.createCategory({ name: 'زیرمجموعه غیرفعال', slug: 'inactive-child', status: 'inactive', parentId: 'cat-0' });
    render(<PublicLayout><div>محتوا</div></PublicLayout>);
    await screen.findByRole('button', { name: 'موبایل' });
    fireEvent.click(screen.getByText('دستهبندیها'));
    expect(screen.getByText('زیرمجموعه آزمایشی')).toBeTruthy();
    expect(screen.queryByText('زیرمجموعه غیرفعال')).toBeNull();
  });
});
