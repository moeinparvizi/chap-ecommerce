import React from 'react';
import { cleanup, fireEvent, render, screen, within } from '@testing-library/react';
import { afterEach, expect, it, vi } from 'vitest';
import { ConfigurationForm } from './ConfigurationForm';
import { customPrintApi } from '../../lib/custom-print-api';
vi.stubGlobal('React', React);
vi.mock('../../lib/custom-print-api', () => ({ customPrintApi: { saveConfiguration: vi.fn() } }));
afterEach(() => {
  cleanup();
  vi.clearAllMocks();
});

it('lists saved print products with visibility, stock and an edit action', async () => {
  const product = { id: 'p', name: 'iPad Air M2', stock: 0, status: 'ACTIVE' };
  vi.mocked(customPrintApi.saveConfiguration).mockResolvedValue({} as never);
  render(
    <ConfigurationForm
      products={[product]}
      configurations={[
        { id: 'c', productId: 'p', type: 'MUG', enabled: true, positions: [], product },
      ]}
      onSaved={vi.fn()}
    />,
  );
  const list = screen.getByRole('region', { name: 'محصولات ثبت‌شده برای چاپ' });
  expect(within(list).getByText('iPad Air M2')).toBeTruthy();
  expect(within(list).getByText('ناموجود؛ قابل مشاهده برای مشتری')).toBeTruthy();
  fireEvent.click(within(list).getByRole('button', { name: 'ویرایش iPad Air M2' }));
  expect(screen.getByLabelText('محصول فروشگاه')).toHaveProperty('value', 'p');
  expect(screen.getByLabelText('نوع محصول چاپی')).toHaveProperty('value', 'MUG');
  fireEvent.click(screen.getByRole('button', { name: 'ذخیره تنظیمات چاپ' }));
  await screen.findByText('تنظیمات محصول ذخیره شد.');
  expect(customPrintApi.saveConfiguration).toHaveBeenCalledWith({
    productId: 'p',
    type: 'MUG',
    enabled: true,
    positions: [],
  });
});
