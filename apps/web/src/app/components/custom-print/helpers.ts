import type { PrintProductType } from '../../lib/custom-print-types';
export const typeLabels: Record<PrintProductType, string> = {
  TSHIRT: 'تیشرت',
  PANTS: 'شلوار',
  MUG: 'ماگ',
  OTHER: 'سایر',
};
export const positionLabels: Record<string, string> = {
  front: 'جلو',
  back: 'پشت',
  left_sleeve: 'آستین چپ',
  right_sleeve: 'آستین راست',
  front_left_leg: 'جلوی پای چپ',
  front_right_leg: 'جلوی پای راست',
  back_left_leg: 'پشت پای چپ',
  back_right_leg: 'پشت پای راست',
};
export const defaultPositions: Record<PrintProductType, string[]> = {
  TSHIRT: ['front', 'back', 'left_sleeve', 'right_sleeve'],
  PANTS: ['front_left_leg', 'front_right_leg', 'back_left_leg', 'back_right_leg'],
  MUG: [],
  OTHER: [],
};
export const statusLabels: Record<string, string> = {
  PENDING_REVIEW: 'در انتظار بررسی',
  APPROVED: 'تأیید شده؛ آماده پرداخت آزمایشی',
  REJECTED: 'رد شده',
  PAID: 'پرداخت آزمایشی ثبت شده',
  PROCESSING: 'در حال آماده‌سازی',
  READY: 'آماده ارسال',
  SHIPPED: 'ارسال شده',
  DELIVERED: 'تحویل شده',
  CANCELLED: 'لغو شده',
  PENDING: 'در انتظار',
};
export function errorMessage(error: unknown) {
  return error instanceof Error ? error.message : 'عملیات ناموفق بود. دوباره تلاش کنید.';
}
export function toman(amount: number) {
  return `${amount.toLocaleString('fa-IR')} تومان`;
}
export function addressText(json: string) {
  try {
    const location = JSON.parse(json);
    return [
      location.title,
      location.address,
      location.city,
      location.postalCode && `کدپستی ${location.postalCode}`,
    ]
      .filter(Boolean)
      .join('، ');
  } catch {
    return json || '—';
  }
}
export function paymentLabel(method?: string) {
  return method === 'test'
    ? 'پرداخت آزمایشی — بدون برداشت وجه'
    : method === 'online'
      ? 'پرداخت آنلاین'
      : method || 'روش پرداخت ثبت نشده';
}

export function availablePrintOrderStatuses(status: string): string[] {
  const transitions: Record<string, string[]> = {
    processing: ['ready', 'cancelled'],
    ready: ['shipped', 'cancelled'],
    shipped: ['delivered'],
    delivered: [],
    cancelled: [],
  };
  return [status, ...(transitions[status] || [])];
}

export function normalizePhone(value: string) {
  return value
    .replace(/[۰-۹]/g, (digit) => String(digit.charCodeAt(0) - 1776))
    .replace(/[٠-٩]/g, (digit) => String(digit.charCodeAt(0) - 1632))
    .replace(/[\s()-]/g, '');
}
