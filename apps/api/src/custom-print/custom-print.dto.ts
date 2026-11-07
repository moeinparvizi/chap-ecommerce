import {
  ArrayMaxSize,
  ArrayUnique,
  IsArray,
  IsBoolean,
  IsIn,
  IsInt,
  IsNumber,
  IsOptional,
  IsString,
  IsUUID,
  Matches,
  Max,
  MaxLength,
  Min,
} from 'class-validator';

export class PrintConfigurationDto {
  @IsUUID() productId!: string;
  @IsIn(['TSHIRT', 'PANTS', 'MUG', 'OTHER']) type!: string;
  @IsBoolean() enabled!: boolean;
  @IsArray()
  @ArrayMaxSize(20)
  @ArrayUnique()
  @IsString({ each: true })
  @MaxLength(80, { each: true })
  positions!: string[];
}
export class CreatePrintRequestDto {
  @IsUUID() productId!: string;
  @IsUUID() designUploadId!: string;
  @IsUUID() locationId!: string;
  @IsString() @Matches(/^\+?[0-9]{10,15}$/) phone!: string;
  @IsInt() @Min(1) @Max(100) quantity!: number;
  @IsArray()
  @ArrayMaxSize(20)
  @ArrayUnique()
  @IsString({ each: true })
  @MaxLength(80, { each: true })
  positions!: string[];
  @IsOptional() @IsString() @MaxLength(80) size?: string;
  @IsOptional() @IsString() @MaxLength(80) color?: string;
  @IsOptional() @IsString() @MaxLength(2000) notes?: string;
}
export class ReviewPrintRequestDto {
  @IsIn(['APPROVED', 'REJECTED']) decision!: 'APPROVED' | 'REJECTED';
  @IsOptional()
  @IsNumber({ allowInfinity: false, allowNaN: false })
  @Min(1)
  @Max(1000000000)
  quotedAmount?: number;
  @IsOptional() @IsString() @MaxLength(2000) reviewNote?: string;
}
