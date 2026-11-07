import { BadRequestException } from '@nestjs/common';
import { ARTWORK_CHUNK_BYTES, MAX_ARTWORK_BYTES } from '@ecommerce/shared';

const SUPPORTED_MIMES = ['image/png', 'image/jpeg', 'application/pdf'];
const PNG_SIGNATURE = Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]);

export function validateUploadDeclaration(input: {
  filename: string;
  mimeType: string;
  size: number;
}) {
  if (
    !input ||
    typeof input.filename !== 'string' ||
    !input.filename.trim() ||
    input.filename.length > 255 ||
    /[\\/\x00-\x1f\x7f]/.test(input.filename)
  ) {
    throw new BadRequestException('Invalid artwork filename');
  }
  if (!SUPPORTED_MIMES.includes(input.mimeType)) {
    throw new BadRequestException('Artwork must be PNG, JPEG or PDF');
  }
  if (!Number.isInteger(input.size) || input.size < 1 || input.size > MAX_ARTWORK_BYTES) {
    throw new BadRequestException('Artwork size must be between 1 byte and 10 MiB');
  }
}

export function decodeArtworkPart(base64: string, expectedSize: number): Buffer {
  // Reject before allocating: Node's decoder alone accepts whitespace and malformed padding.
  if (
    typeof base64 !== 'string' ||
    base64.length !== 4 * Math.ceil(expectedSize / 3) ||
    expectedSize < 1 ||
    expectedSize > ARTWORK_CHUNK_BYTES ||
    !/^(?:[A-Za-z0-9+/]{4})*(?:[A-Za-z0-9+/]{2}==|[A-Za-z0-9+/]{3}=)?$/.test(base64)
  ) {
    throw new BadRequestException('Invalid artwork part encoding or size');
  }
  const data = Buffer.from(base64, 'base64');
  if (data.length !== expectedSize || data.toString('base64') !== base64) {
    throw new BadRequestException('Invalid artwork part encoding or size');
  }
  return data;
}

export function validateArtworkSignature(mimeType: string, data: Uint8Array) {
  const prefix = Buffer.from(data.subarray(0, 8));
  const valid =
    mimeType === 'image/png'
      ? prefix.length >= 8 && prefix.equals(PNG_SIGNATURE)
      : mimeType === 'image/jpeg'
        ? prefix.length >= 3 && prefix[0] === 255 && prefix[1] === 216 && prefix[2] === 255
        : mimeType === 'application/pdf' && /^%PDF-[12]\.[0-9]/.test(prefix.toString('latin1'));
  if (!valid) throw new BadRequestException('Artwork content does not match its MIME type');
}
