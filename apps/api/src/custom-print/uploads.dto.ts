import { ARTWORK_CHUNK_BYTES, MAX_ARTWORK_BYTES } from '@ecommerce/shared';
import { IsIn, IsInt, IsString, Matches, Max, MaxLength, Min, MinLength } from 'class-validator';

export class StartUploadDto {
  @IsString()
  @MinLength(1)
  @MaxLength(255)
  @Matches(/^[^\\/\x00-\x1f\x7f]+$/)
  filename!: string;

  @IsIn(['image/png', 'image/jpeg', 'application/pdf'])
  mimeType!: string;

  @IsInt()
  @Min(1)
  @Max(MAX_ARTWORK_BYTES)
  size!: number;
}

export class UploadPartDto {
  @IsString()
  @MinLength(4)
  @MaxLength(4 * Math.ceil(ARTWORK_CHUNK_BYTES / 3))
  base64!: string;
}
