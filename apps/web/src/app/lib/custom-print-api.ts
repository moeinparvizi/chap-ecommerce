import { isDemoSession } from './demo';
import { MAX_ARTWORK_BYTES, ARTWORK_CHUNK_BYTES } from '@ecommerce/shared';
import type {
  CreatePrintRequest,
  PrintOrder,
  PrintProduct,
  PrintRequest,
  PrintSettings,
  PrintUpload,
  ReviewPrintRequest,
} from './custom-print-types';
export { MAX_ARTWORK_BYTES, ARTWORK_CHUNK_BYTES };

const API_BASE = (process.env.NEXT_PUBLIC_API_URL || '/api').replace(/\/$/, '');
// Print reads use the server; demo sessions cannot submit changes.
async function request<T>(path: string, method = 'GET', body?: unknown): Promise<T> {
  if (isDemoSession() && method !== 'GET') throw new Error('این قابلیت در حالت نمایشی در دسترس نیست.');
  const headers = new Headers({ 'Content-Type': 'application/json' });
  const token = typeof window !== 'undefined' ? localStorage.getItem('auth_token') : null;
  if (token) headers.set('Authorization', `Bearer ${token}`);
  const response = await fetch(`${API_BASE}${path}`, {
    method,
    headers,
    cache: 'no-store',
    ...(body === undefined ? {} : { body: JSON.stringify(body) }),
  });
  const payload = await response.json().catch(() => null);
  if (!response.ok) {
    const message = Array.isArray(payload?.message) ? payload.message.join('، ') : payload?.message;
    throw new Error(
      typeof message === 'string'
        ? message
        : `ارتباط با سرور ناموفق بود (${response.status}). دوباره تلاش کنید.`,
    );
  }
  if (payload === null) throw new Error('پاسخ سرور معتبر نیست. دوباره تلاش کنید.');
  return payload as T;
}
const root = '/custom-print';
export const customPrintApi = {
  settings: () => request<PrintSettings>(`${root}/settings`),
  products: () => request<PrintProduct[]>(`${root}/products`),
  configurations: () => request<PrintProduct[]>(`${root}/configurations`),
  saveConfiguration: (body: {
    productId: string;
    type: string;
    enabled: boolean;
    positions: string[];
  }) => request<PrintProduct>(`${root}/configurations`, 'POST', body),
  requests: () => request<PrintRequest[]>(`${root}/requests`),
  createRequest: (body: CreatePrintRequest) =>
    request<PrintRequest>(`${root}/requests`, 'POST', body),
  review: (id: string, body: ReviewPrintRequest) =>
    request<PrintRequest>(`${root}/requests/${encodeURIComponent(id)}/review`, 'POST', body),
  payTest: (id: string) =>
    request<PrintOrder>(`${root}/requests/${encodeURIComponent(id)}/pay-test`, 'POST'),
};
export function artworkError(file: File): string | null {
  if (!['image/png', 'image/jpeg', 'application/pdf'].includes(file.type))
    return 'فقط فایل PNG، JPG یا PDF انتخاب کنید.';
  if (!file.size || file.size > MAX_ARTWORK_BYTES)
    return 'حجم فایل باید بیشتر از صفر و حداکثر 10 MiB باشد.';
  return null;
}
function readBase64(blob: Blob): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onerror = () => reject(new Error('خواندن فایل ناموفق بود. فایل را دوباره انتخاب کنید.'));
    reader.onload = () => resolve(String(reader.result).split(',')[1]);
    reader.readAsDataURL(blob);
  });
}
export async function uploadArtwork(
  file: File,
  onProgress?: (percent: number) => void,
): Promise<PrintUpload> {
  const error = artworkError(file);
  if (error) throw new Error(error);
  onProgress?.(0);
  const upload = await request<PrintUpload>(`${root}/uploads`, 'POST', {
    filename: file.name,
    mimeType: file.type,
    size: file.size,
  });
  const totalChunks = Math.ceil(file.size / ARTWORK_CHUNK_BYTES);
  for (let index = 0; index < totalChunks; index++) {
    const base64 = await readBase64(
      file.slice(
        index * ARTWORK_CHUNK_BYTES,
        Math.min((index + 1) * ARTWORK_CHUNK_BYTES, file.size),
      ),
    );
    await request(`${root}/uploads/${encodeURIComponent(upload.id)}/parts/${index}`, 'PUT', {
      base64,
    });
    onProgress?.(Math.round(((index + 1) / totalChunks) * 95));
  }
  const result = await request<PrintUpload>(
    `${root}/uploads/${encodeURIComponent(upload.id)}/complete`,
    'POST',
  );
  onProgress?.(100);
  return result;
}
export async function downloadArtwork(uploadId: string): Promise<{ blob: Blob; filename: string }> {
  const path = `${root}/uploads/${encodeURIComponent(uploadId)}`;
  const upload = await request<PrintUpload>(path);
  if (
    !upload.completed ||
    upload.size < 1 ||
    upload.size > MAX_ARTWORK_BYTES ||
    upload.totalChunks !== Math.ceil(upload.size / ARTWORK_CHUNK_BYTES)
  )
    throw new Error('اطلاعات فایل معتبر نیست.');
  const parts: Uint8Array<ArrayBuffer>[] = [];
  for (let index = 0; index < upload.totalChunks; index++) {
    const { base64 } = await request<{ base64: string }>(`${path}/parts/${index}`);
    const decoded = atob(base64);
    const expected = Math.min(ARTWORK_CHUNK_BYTES, upload.size - index * ARTWORK_CHUNK_BYTES);
    if (decoded.length !== expected) throw new Error('فایل ناقص دریافت شد. دوباره تلاش کنید.');
    const bytes = new Uint8Array(decoded.length);
    for (let i = 0; i < decoded.length; i++) bytes[i] = decoded.charCodeAt(i);
    parts.push(bytes);
  }
  return { blob: new Blob(parts, { type: upload.mimeType }), filename: upload.filename };
}
