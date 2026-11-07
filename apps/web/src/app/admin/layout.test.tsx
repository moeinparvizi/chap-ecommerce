import React from 'react';
import { cleanup, fireEvent, render, screen } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import AdminLayout from './layout';

vi.stubGlobal('React', React);
const { push, router } = vi.hoisted(() => {
  const push = vi.fn();
  return { push, router: { push } };
});
vi.mock('next/navigation', () => ({
  useRouter: () => router,
  usePathname: () => '/admin/custom-print',
}));
vi.mock('../lib/notifications', () => ({
  NotificationProvider: ({ children }: { children: React.ReactNode }) => children,
}));
vi.mock('../lib/i18n', () => ({
  I18nProvider: ({ children }: { children: React.ReactNode }) => children,
  useI18n: () => ({ t: (key: string) => key, lang: 'fa', toggleLang: vi.fn() }),
}));

beforeEach(() => {
  localStorage.setItem('auth_token', 'admin-token');
  localStorage.setItem('user', JSON.stringify({ name: 'Admin', email: 'admin@example.test', role: 'super_admin' }));
});
afterEach(() => {
  cleanup();
  localStorage.clear();
  vi.clearAllMocks();
});

describe('admin session changes across tabs', () => {
  it('hides the stale admin page when another tab signs in as a customer', () => {
    render(<AdminLayout><div>Private print configuration</div></AdminLayout>);
    expect(screen.queryByText('Private print configuration')).not.toBeNull();
    localStorage.setItem('auth_token', 'customer-token');
    localStorage.setItem('user', JSON.stringify({ name: 'Customer', role: 'customer' }));
    fireEvent(window, new StorageEvent('storage', { key: 'user', storageArea: localStorage }));
    expect(screen.queryByText('Private print configuration')).toBeNull();
    expect(push).toHaveBeenCalledWith('/account');
  });

  it('detects logout when the old admin tab regains focus', () => {
    render(<AdminLayout><div>Private print configuration</div></AdminLayout>);
    localStorage.removeItem('auth_token');
    fireEvent(window, new Event('focus'));
    expect(screen.queryByText('Private print configuration')).toBeNull();
    expect(push).toHaveBeenCalledWith('/auth/login');
  });

  it('handles malformed stored profiles without crashing', () => {
    localStorage.setItem('user', '{broken');
    expect(() => render(<AdminLayout><div>Private print configuration</div></AdminLayout>)).not.toThrow();
    expect(screen.queryByText('Private print configuration')).toBeNull();
    expect(push).toHaveBeenCalledWith('/auth/login');
  });
});
