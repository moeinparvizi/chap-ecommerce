import { afterEach, describe, expect, it, vi } from 'vitest';
import {
  customPrintApi,
  uploadArtwork,
  downloadArtwork,
  MAX_ARTWORK_BYTES,
  ARTWORK_CHUNK_BYTES,
} from './custom-print-api';

afterEach(() => {
  vi.unstubAllGlobals();
  localStorage.clear();
});
const json = (body: unknown, ok = true) => ({ ok, status: ok ? 200 : 400, json: async () => body });
describe('private print transport', () => {
  it('uploads 10 MiB in ten bounded authenticated chunks with progress', async () => {
    localStorage.setItem('auth_token', 'real-token');
    const fetcher = vi.fn(async (url: string) =>
      json(
        url.endsWith('/complete')
          ? { id: 'upload', completed: true }
          : url.endsWith('/uploads')
            ? { id: 'upload', totalChunks: 10 }
            : { stored: true },
      ),
    );
    vi.stubGlobal('fetch', fetcher);
    const progress = vi.fn();
    const file = new File([new Uint8Array(MAX_ARTWORK_BYTES)], 'art.png', { type: 'image/png' });
    await uploadArtwork(file, progress);
    const parts = fetcher.mock.calls.filter(([url]) => url.includes('/parts/'));
    expect(parts).toHaveLength(10);
    for (const call of parts) {
      const options = (call as unknown as [string, RequestInit])[1];
      expect(atob(JSON.parse(options.body as string).base64)).toHaveLength(ARTWORK_CHUNK_BYTES);
      expect(new Headers(options.headers).get('Authorization')).toBe('Bearer real-token');
    }
    expect(progress).toHaveBeenLastCalledWith(100);
  });
  it('rejects oversized or unsupported artwork before making a request', async () => {
    const fetcher = vi.fn();
    vi.stubGlobal('fetch', fetcher);
    await expect(
      uploadArtwork(
        new File([new Uint8Array(MAX_ARTWORK_BYTES + 1)], 'large.png', { type: 'image/png' }),
      ),
    ).rejects.toThrow('10');
    await expect(
      uploadArtwork(new File(['x'], 'bad.svg', { type: 'image/svg+xml' })),
    ).rejects.toThrow('PNG');
    expect(fetcher).not.toHaveBeenCalled();
  });
  it('reports API validation errors and never returns demo success', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn(async () => json({ message: ['قیمت تغییر کرده', 'دوباره تلاش کنید'] }, false)),
    );
    await expect(customPrintApi.payTest('r')).rejects.toThrow('قیمت تغییر کرده');
  });
  it('downloads private parts and verifies exact size', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn(async (url: string) =>
        json(
          url.includes('/parts/')
            ? { base64: btoa('abc') }
            : {
                id: 'u',
                filename: 'art.pdf',
                mimeType: 'application/pdf',
                size: 3,
                totalChunks: 1,
                completed: true,
              },
        ),
      ),
    );
    const result = await downloadArtwork('u');
    expect(result.blob.size).toBe(3);
    expect(result.filename).toBe('art.pdf');
  });
});
