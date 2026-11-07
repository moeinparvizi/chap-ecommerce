import { IsIn, IsOptional, IsString, IsUUID, MaxLength, MinLength } from 'class-validator';
import { PartialType } from '@nestjs/swagger';

export class CreateCategoryDto {
  @IsString() @MinLength(1) @MaxLength(200) name!: string;
  @IsOptional() @IsString() @MaxLength(200) slug?: string;
  @IsOptional() @IsString() description?: string;
  @IsOptional() @IsString() image?: string | null;
  @IsOptional() @IsUUID() parentId?: string | null;
  @IsOptional() @IsIn(['active', 'inactive']) status?: string;
}

export class UpdateCategoryDto extends PartialType(CreateCategoryDto) {}
