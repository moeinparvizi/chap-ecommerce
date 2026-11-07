import { describe, expect, it, vi } from 'vitest';

import { UploadsService } from '../src/custom-print/uploads.service';

const CHUNK = 1024 * 1024;
const MAX = 10 * CHUNK;
const owner = { id: 'owner', role: 'CUSTOMER' };
const png = (size = 32) => {
  const bytes = Buffer.alloc(size, 65);
  Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]).copy(bytes);
  return bytes;
};

// In-memory persistence double; assertions exercise public service behavior and bytes.
function fixture() {
  const uploads = new Map<string, any>();
  const parts = new Map<string, any>();
  let next = 0;
  const matches = (row: any, where: any) =>
    Object.entries(where).every(([key, value]: any) => {
      if (key === 'request') return (row.request || null) === value;
      if (key === 'createdAt') return row.createdAt < value.lt;
      return row[key] === value;
    });
  const db: any = {
    $queryRaw: async () => [],
    printUpload: {
      create: async ({ data }: any) => {
        const row = { id: `upload-${++next}`, createdAt: new Date(), completed: false, ...data };
        uploads.set(row.id, row);
        return { ...row };
      },
      findUnique: async ({ where }: any) =>
        uploads.get(where.id) ? { ...uploads.get(where.id) } : null,
      count: async ({ where }: any) =>
        [...uploads.values()].filter((row) => matches(row, where)).length,
      deleteMany: async ({ where }: any) => {
        for (const row of uploads.values()) {
          if (matches(row, where)) {
            uploads.delete(row.id);
            for (const [key, part] of parts) if (part.uploadId === row.id) parts.delete(key);
          }
        }
        return { count: 0 };
      },
      update: async ({ where, data }: any) => {
        Object.assign(uploads.get(where.id), data);
        return { ...uploads.get(where.id) };
      },
    },
    printUploadPart: {
      findUnique: async ({ where: { uploadId_index: key } }: any) =>
        parts.get(`${key.uploadId}:${key.index}`) || null,
      findMany: async ({ where }: any) =>
        [...parts.values()]
          .filter((part) => part.uploadId === where.uploadId)
          .sort((a, b) => a.index - b.index),
      create: async ({ data }: any) => {
        parts.set(`${data.uploadId}:${data.index}`, { ...data, data: Buffer.from(data.data) });
        return data;
      },
    },
  };
  db.$transaction = async (fn: any) => fn(db);
  const service = new UploadsService(db);
  const start = (size = 32, mimeType = 'image/png', filename = 'art.png') =>
    service.start(owner.id, { filename, mimeType, size });
  const ready = async (bytes = png(), mimeType = 'image/png') => {
    const upload = await start(bytes.length, mimeType);
    for (let i = 0; i < upload.totalChunks; i++)
      await service.part(
        owner.id,
        upload.id,
        i,
        bytes.subarray(i * CHUNK, (i + 1) * CHUNK).toString('base64'),
      );
    return upload;
  };
  return { service, start, ready, uploads, parts };
}

describe('private print artwork uploads', () => {
  it('accepts and returns exactly 10 MiB through ten bounded private parts', async () => {
    const { service, ready } = fixture();
    const bytes = png(MAX);
    const started = await ready(bytes);
    expect(started.totalChunks).toBe(10);
    const completed = await service.complete(owner.id, started.id);
    expect(completed).toEqual({
      id: started.id,
      filename: 'art.png',
      mimeType: 'image/png',
      size: MAX,
      totalChunks: 10,
      completed: true,
    });
    const downloaded: Buffer[] = [];
    for (let i = 0; i < 10; i++) {
      const part = await service.downloadPart(owner, started.id, i);
      const decoded = Buffer.from(part.base64, 'base64');
      expect(decoded.length).toBe(CHUNK);
      downloaded.push(decoded);
    }
    expect(Buffer.concat(downloaded).equals(bytes)).toBe(true);
    expect(await service.complete(owner.id, started.id)).toEqual(completed);
  });

  it.each([0, -1, 0.5, MAX + 1, NaN, Infinity])(
    'rejects invalid declared size %s',
    async (size) => {
      await expect(fixture().start(size)).rejects.toThrow('Artwork size');
    },
  );
  it.each(['image/svg+xml', 'text/html', 'IMAGE/PNG', 'application/octet-stream'])(
    'rejects unsupported MIME %s',
    async (mime) => {
      await expect(fixture().start(32, mime)).rejects.toThrow('Artwork must be');
    },
  );
  it.each(['../art.png', 'folder\\art.png', 'bad\r\nname.png', '', 'a'.repeat(256)])(
    'rejects unsafe filename %s',
    async (filename) => {
      await expect(fixture().start(32, 'image/png', filename)).rejects.toThrow('filename');
    },
  );

  it.each([
    '%%%',
    'AAAA\n',
    'data:image/png;base64,AAAA',
    'AAA',
    'AB==',
    '',
    'A'.repeat(Math.ceil(CHUNK / 3) * 4 + 4),
  ])('rejects malformed or oversized base64', async (base64) => {
    const { service, start } = fixture();
    const upload = await start(1);
    await expect(service.part(owner.id, upload.id, 0, base64)).rejects.toThrow('encoding or size');
  });
  it('rejects a maximum-length malformed part without an unbounded decoder error', async () => {
    const { service, start } = fixture();
    const upload = await start(CHUNK);
    await expect(service.part(owner.id, upload.id, 0, 'A'.repeat(1398103) + '!')).rejects.toThrow(
      'encoding or size',
    );
  });
  it('requires the declared exact part size and bounded integer indices', async () => {
    const { service, start } = fixture();
    const upload = await start(CHUNK + 5);
    for (const index of [-1, 0.5, 2, NaN])
      await expect(
        service.part(owner.id, upload.id, index, png().toString('base64')),
      ).rejects.toThrow();
    await expect(service.part(owner.id, upload.id, 0, png().toString('base64'))).rejects.toThrow();
    await expect(service.part(owner.id, upload.id, 1, png(6).toString('base64'))).rejects.toThrow();
  });
  it('allows identical retry, rejects changed retry and any write after completion', async () => {
    const { service, ready } = fixture();
    const upload = await ready();
    expect(await service.part(owner.id, upload.id, 0, png().toString('base64'))).toEqual({
      stored: true,
    });
    await expect(
      service.part(owner.id, upload.id, 0, Buffer.alloc(32).toString('base64')),
    ).rejects.toThrow();
    await service.complete(owner.id, upload.id);
    await expect(service.part(owner.id, upload.id, 0, png().toString('base64'))).rejects.toThrow();
  });
  it('rejects missing, noncontiguous and inconsistent stored parts on completion', async () => {
    const { service, start, parts } = fixture();
    const upload = await start(CHUNK + 5);
    await service.part(owner.id, upload.id, 0, png(CHUNK).toString('base64'));
    await expect(service.complete(owner.id, upload.id)).rejects.toThrow();
    parts.set(`${upload.id}:2`, { uploadId: upload.id, index: 2, data: Buffer.alloc(5) });
    await expect(service.complete(owner.id, upload.id)).rejects.toThrow();
    parts.delete(`${upload.id}:2`);
    parts.set(`${upload.id}:1`, { uploadId: upload.id, index: 1, data: Buffer.alloc(4) });
    await expect(service.complete(owner.id, upload.id)).rejects.toThrow();
  });
  it.each([
    ['image/png', Buffer.alloc(32)],
    ['image/jpeg', png()],
    ['application/pdf', png()],
    ['application/pdf', Buffer.from([0xa5, 0x50, 0x44, 0x46, 0x2d, 0x31, 0x2e, 0x37])],
  ])('rejects mismatched %s file signature', async (mime, bytes) => {
    const { service, ready } = fixture();
    const upload = await ready(bytes as Buffer, mime as string);
    await expect(service.complete(owner.id, upload.id)).rejects.toThrow('content does not match');
  });
  it.each([
    ['image/jpeg', Buffer.from([255, 216, 255, 224, 1, 2, 255, 217])],
    ['application/pdf', Buffer.from('%PDF-1.7\ncontent\n%%EOF')],
  ])('accepts supported %s signatures', async (mime, bytes) => {
    const { service, ready } = fixture();
    const upload = await ready(bytes as Buffer, mime as string);
    expect((await service.complete(owner.id, upload.id)).completed).toBe(true);
  });
  it('enforces private owner writes/reads and permits completed admin reads', async () => {
    const { service, ready } = fixture();
    const upload = await ready();
    const stranger = { id: 'stranger', role: 'CUSTOMER' };
    await expect(
      service.part(stranger.id, upload.id, 0, png().toString('base64')),
    ).rejects.toThrow();
    await expect(service.complete(stranger.id, upload.id)).rejects.toThrow();
    await expect(service.metadata(stranger, upload.id)).rejects.toThrow('another customer');
    await expect(service.downloadPart(stranger, upload.id, 0)).rejects.toThrow();
    await expect(service.downloadPart(owner, upload.id, 0)).rejects.toThrow();
    await service.complete(owner.id, upload.id);
    await expect(service.metadata(stranger, upload.id)).rejects.toThrow('another customer');
    await expect(service.downloadPart(stranger, upload.id, 0)).rejects.toThrow('another customer');
    for (const role of ['ADMIN', 'SUPER_ADMIN', 'admin', 'superadmin']) {
      expect((await service.metadata({ id: 'manager', role }, upload.id)).completed).toBe(true);
      expect((await service.downloadPart({ id: 'manager', role }, upload.id, 0)).base64).toBe(
        png().toString('base64'),
      );
    }
    await expect(service.downloadPart(owner, upload.id, -1)).rejects.toThrow();
    await expect(service.metadata(owner, 'missing')).rejects.toThrow();
  });
  it('limits pending uploads to five per user and reclaims expired sessions with parts', async () => {
    const { service, start, ready, uploads, parts } = fixture();
    const first = await ready();
    for (let i = 1; i < 5; i++) await start();
    await expect(start()).rejects.toThrow('five unattached');
    uploads.get(first.id).createdAt = new Date(Date.now() - 24 * 60 * 60 * 1000 - 1);
    await expect(service.metadata(owner, first.id)).rejects.toThrow();
    await expect(service.complete(owner.id, first.id)).rejects.toThrow();
    const replacement = await start();
    expect(replacement.completed).toBe(false);
    expect(uploads.has(first.id)).toBe(false);
    expect([...parts.values()].some((part) => part.uploadId === first.id)).toBe(false);
  });
  it('rejects expired writes and never exposes incomplete artwork to administrators', async () => {
    const { service, ready, uploads } = fixture();
    const upload = await ready();
    expect((await service.metadata(owner, upload.id)).completed).toBe(false);
    await expect(service.metadata({ id: 'manager', role: 'ADMIN' }, upload.id)).rejects.toThrow(
      'another customer',
    );
    uploads.get(upload.id).createdAt = new Date(0);
    await expect(service.part(owner.id, upload.id, 0, png().toString('base64'))).rejects.toThrow(
      'expired',
    );
    await expect(service.downloadPart(owner, upload.id, 0)).rejects.toThrow('expired');
  });
  it('counts completed orphan artwork toward quota until attached', async () => {
    const { service, ready, start, uploads } = fixture();
    const upload = await ready();
    for (let i = 1; i < 5; i++) await start();
    await service.complete(owner.id, upload.id);
    await expect(start()).rejects.toThrow('five unattached');
    uploads.get(upload.id).request = { id: 'request' };
    expect((await start()).completed).toBe(false);
  });
  it('reclaims completed expired orphans but preserves attached artwork', async () => {
    const { service, ready, start, uploads } = fixture();
    const orphan = await ready();
    await service.complete(owner.id, orphan.id);
    const attached = await ready();
    await service.complete(owner.id, attached.id);
    uploads.get(orphan.id).createdAt = new Date(0);
    uploads.get(attached.id).createdAt = new Date(0);
    uploads.get(attached.id).request = { id: 'request' };
    await start();
    expect(uploads.has(orphan.id)).toBe(false);
    expect(uploads.has(attached.id)).toBe(true);
  });
  it.each([1, 2, 3])('accepts canonical base64 for a %s-byte final part', async (size) => {
    const { service, start } = fixture();
    const upload = await start(CHUNK + size);
    await service.part(owner.id, upload.id, 0, png(CHUNK).toString('base64'));
    await service.part(owner.id, upload.id, 1, Buffer.alloc(size, 255).toString('base64'));
    expect((await service.complete(owner.id, upload.id)).completed).toBe(true);
  });
  it('does not expire attached completed artwork', async () => {
    const { service, ready, uploads } = fixture();
    const upload = await ready();
    await service.complete(owner.id, upload.id);
    uploads.get(upload.id).createdAt = new Date(0);
    uploads.get(upload.id).request = { id: 'request' };
    expect((await service.downloadPart(owner, upload.id, 0)).base64).toBe(png().toString('base64'));
  });
});
