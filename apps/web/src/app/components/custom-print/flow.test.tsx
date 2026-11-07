import React from 'react';
import { cleanup, fireEvent, render, screen, waitFor } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import CustomPrintPage from '../../(public)/custom-print/page';
import PrintRequestsPage from '../../(public)/account/print-requests/page';
import { ReviewForm } from './ReviewForm';
import { api } from '../../lib/api';
import { customPrintApi, uploadArtwork } from '../../lib/custom-print-api';
vi.stubGlobal('React', React);
const { push } = vi.hoisted(() => ({ push: vi.fn() }));
vi.mock('next/navigation', () => ({ useRouter: () => ({ push }) }));
vi.mock('../../lib/api', () => ({ api: { getLocations: vi.fn() } }));
vi.mock('../../lib/custom-print-api', async (importOriginal) => ({
  ...(await importOriginal<object>()),
  customPrintApi: {
    products: vi.fn(),
    settings: vi.fn(),
    createRequest: vi.fn(),
    requests: vi.fn(),
    payTest: vi.fn(),
    review: vi.fn(),
  },
  uploadArtwork: vi.fn(),
}));
const shirt = {
  id: 'config',
  productId: 'p',
  type: 'TSHIRT',
  enabled: true,
  positions: ['front', 'back'],
  product: { id: 'p', name: 'تیشرت', stock: 8, images: [] },
};
const request = {
  id: 'r',
  productName: 'تیشرت',
  productType: 'TSHIRT',
  quantity: 1,
  positions: ['front'],
  phone: '09123456789',
  status: 'APPROVED',
  quotedAmount: 50000,
  designUploadId: 'u',
  designUpload: {
    id: 'u',
    filename: 'a.png',
    mimeType: 'image/png',
    size: 10,
    totalChunks: 1,
    completed: true,
  },
  createdAt: '2026-11-07',
  locationJson: '{}',
};
beforeEach(() => {
  localStorage.setItem('auth_token', 'token');
  localStorage.setItem('user', JSON.stringify({ id: 'customer', phone: '09123456789' }));
  vi.mocked(customPrintApi.products).mockResolvedValue([shirt] as never);
  vi.mocked(customPrintApi.settings).mockResolvedValue({
    testPaymentEnabled: true,
    maxUploadBytes: 10485760,
    chunkBytes: 1048576,
  });
  vi.mocked(api.getLocations).mockResolvedValue([
    { id: 'loc', title: 'خانه', address: 'خیابان', city: 'تهران', isDefault: true },
  ]);
  vi.mocked(uploadArtwork).mockResolvedValue({ id: 'u', completed: true } as never);
  vi.stubGlobal('URL', { createObjectURL: vi.fn(() => 'blob:preview'), revokeObjectURL: vi.fn() });
});
afterEach(() => {
  cleanup();
  vi.clearAllMocks();
  localStorage.clear();
});
async function fillRequest() {
  await screen.findByText('تیشرت');
  fireEvent.change(screen.getByLabelText('فایل طرح'), {
    target: { files: [new File(['a'], 'a.png', { type: 'image/png' })] },
  });
  fireEvent.change(screen.getByLabelText('سایز'), { target: { value: 'XL' } });
  fireEvent.change(screen.getByLabelText('رنگ'), { target: { value: 'سفید' } });
}
describe('customer print request', () => {
  it('requires a garment position and preserves artwork and fields on server error', async () => {
    vi.mocked(customPrintApi.createRequest).mockRejectedValue(new Error('موجودی کافی نیست'));
    render(<CustomPrintPage />);
    await fillRequest();
    fireEvent.click(screen.getByRole('button', { name: 'ارسال برای بررسی' }));
    expect(await screen.findByRole('alert')).toHaveProperty(
      'textContent',
      expect.stringContaining('محل چاپ'),
    );
    expect(customPrintApi.createRequest).not.toHaveBeenCalled();
    fireEvent.click(screen.getByLabelText('جلو'));
    fireEvent.click(screen.getByRole('button', { name: 'ارسال برای بررسی' }));
    expect(await screen.findByText('موجودی کافی نیست')).toBeTruthy();
    expect(screen.getByLabelText('سایز')).toHaveProperty('value', 'XL');
    expect(screen.getByText('a.png')).toBeTruthy();
    expect(customPrintApi.createRequest).toHaveBeenCalledWith(
      expect.objectContaining({
        designUploadId: 'u',
        locationId: 'loc',
        positions: ['front'],
        quantity: 1,
      }),
    );
  });
  it('normalizes formatted Persian phone numbers before uploading and submitting', async () => {
    vi.mocked(customPrintApi.createRequest).mockResolvedValue(request as never);
    render(<CustomPrintPage />);
    await fillRequest();
    fireEvent.click(screen.getByLabelText('جلو'));
    fireEvent.change(screen.getByLabelText('تلفن تماس'), { target: { value: '۰۹۱۲ ۳۴۵-۶۷۸۹' } });
    fireEvent.click(screen.getByRole('button', { name: 'ارسال برای بررسی' }));
    await waitFor(() =>
      expect(customPrintApi.createRequest).toHaveBeenCalledWith(
        expect.objectContaining({ phone: '09123456789' }),
      ),
    );
  });
  it('rejects short phone numbers before uploading artwork', async () => {
    render(<CustomPrintPage />);
    await fillRequest();
    fireEvent.click(screen.getByLabelText('جلو'));
    fireEvent.change(screen.getByLabelText('تلفن تماس'), { target: { value: '1234567' } });
    fireEvent.click(screen.getByRole('button', { name: 'ارسال برای بررسی' }));
    expect(await screen.findByRole('alert')).toBeTruthy();
    expect(uploadArtwork).not.toHaveBeenCalled();
  });
  it('hides mug positions and submits an empty position list', async () => {
    vi.mocked(customPrintApi.products).mockResolvedValue([
      { ...shirt, type: 'MUG', positions: [], product: { ...shirt.product, name: 'ماگ' } },
    ] as never);
    vi.mocked(customPrintApi.createRequest).mockResolvedValue(request as never);
    render(<CustomPrintPage />);
    await screen.findByText('ماگ');
    expect(screen.queryByRole('group', { name: 'محل چاپ' })).toBeNull();
    expect(screen.queryByLabelText('سایز')).toBeNull();
    fireEvent.change(screen.getByLabelText('فایل طرح'), {
      target: { files: [new File(['a'], 'a.png', { type: 'image/png' })] },
    });
    fireEvent.click(screen.getByRole('button', { name: 'ارسال برای بررسی' }));
    await waitFor(() =>
      expect(customPrintApi.createRequest).toHaveBeenCalledWith(
        expect.objectContaining({ positions: [] }),
      ),
    );
    expect(push).toHaveBeenCalledWith('/account/print-requests');
  });
  it('requires artwork, contact telephone and an owned address', async () => {
    localStorage.setItem('user', JSON.stringify({ id: 'customer' }));
    vi.mocked(api.getLocations).mockResolvedValue([]);
    render(<CustomPrintPage />);
    await screen.findByText('تیشرت');
    fireEvent.click(screen.getByRole('button', { name: 'ارسال برای بررسی' }));
    expect(await screen.findByRole('alert')).toBeTruthy();
    expect(customPrintApi.createRequest).not.toHaveBeenCalled();
    expect(screen.getByRole('link', { name: 'مدیریت آدرس‌ها' })).toBeTruthy();
  });
});
describe('review and payment', () => {
  it('requires a positive quote or a rejection reason and shows stale-review errors', async () => {
    vi.mocked(customPrintApi.review).mockRejectedValue(
      new Error('این درخواست قبلاً بررسی شده است'),
    );
    render(<ReviewForm requestId="r" onReviewed={vi.fn()} />);
    fireEvent.click(screen.getByRole('button', { name: 'تأیید و اعلام قیمت' }));
    expect(await screen.findByRole('alert')).toHaveProperty(
      'textContent',
      expect.stringContaining('مبلغ'),
    );
    fireEvent.click(screen.getByRole('button', { name: 'رد درخواست' }));
    expect(screen.getByRole('alert').textContent).toContain('دلیل');
    fireEvent.change(screen.getByLabelText('قیمت نهایی (تومان)'), { target: { value: '50000' } });
    fireEvent.click(screen.getByRole('button', { name: 'تأیید و اعلام قیمت' }));
    expect(await screen.findByText('این درخواست قبلاً بررسی شده است')).toBeTruthy();
    expect(customPrintApi.review).toHaveBeenCalledWith('r', {
      decision: 'APPROVED',
      quotedAmount: 50000,
      reviewNote: undefined,
    });
  });
  it('simulates approved payment and links the ordinary order', async () => {
    vi.mocked(customPrintApi.requests).mockResolvedValue([request] as never);
    vi.mocked(customPrintApi.payTest).mockResolvedValue({
      id: 'order',
      paymentMethod: 'test',
    } as never);
    render(<PrintRequestsPage />);
    fireEvent.click(
      await screen.findByRole('button', { name: 'پرداخت آزمایشی — بدون برداشت وجه' }),
    );
    await waitFor(() => expect(push).toHaveBeenCalledWith('/account/orders'));
    expect(customPrintApi.payTest).toHaveBeenCalledWith('r');
  });
  it('disables payment unless the server enables test mode and surfaces payment failures', async () => {
    vi.mocked(customPrintApi.requests).mockResolvedValue([request] as never);
    vi.mocked(customPrintApi.settings).mockResolvedValue({
      testPaymentEnabled: false,
      maxUploadBytes: 10485760,
      chunkBytes: 1048576,
    });
    render(<PrintRequestsPage />);
    expect(await screen.findByText('پرداخت آزمایشی در حال حاضر غیرفعال است.')).toBeTruthy();
    expect(screen.queryByRole('button', { name: 'پرداخت آزمایشی — بدون برداشت وجه' })).toBeNull();
  });
});
