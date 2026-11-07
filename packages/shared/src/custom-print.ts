export type PrintProductType = 'TSHIRT' | 'PANTS' | 'MUG' | 'OTHER';
export type PrintRequestStatus = 'PENDING_REVIEW' | 'APPROVED' | 'REJECTED' | 'PAID';
export const MAX_ARTWORK_BYTES = 10 * 1024 * 1024;
export const ARTWORK_CHUNK_BYTES = 1024 * 1024;
export const DEFAULT_PRINT_POSITIONS: Record<PrintProductType, string[]> = {
  TSHIRT: ['front', 'back', 'left_sleeve', 'right_sleeve'],
  PANTS: ['front_left_leg', 'front_right_leg', 'back_left_leg', 'back_right_leg'],
  MUG: [],
  OTHER: [],
};
export const PRINT_POSITION_LABELS: Record<string, string> = {
  front: 'جلو',
  back: 'پشت',
  left_sleeve: 'آستین چپ',
  right_sleeve: 'آستین راست',
  front_left_leg: 'جلوی پای چپ',
  front_right_leg: 'جلوی پای راست',
  back_left_leg: 'پشت پای چپ',
  back_right_leg: 'پشت پای راست',
};
