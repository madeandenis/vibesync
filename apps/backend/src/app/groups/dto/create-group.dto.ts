import {
  IsString,
  IsOptional,
  IsBoolean,
  IsNotEmpty,
  IsUUID,
} from 'class-validator';

export class CreateGroupDto {
  @IsUUID()
  @IsNotEmpty()
  owner_id: string;

  @IsString()
  @IsNotEmpty()
  name: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsString()
  ip_address?: string;

  @IsOptional()
  cover_image?: Buffer;

  @IsOptional()
  @IsString()
  cover_image_name?: string;

  @IsOptional()
  qr_code_image?: Buffer;

  @IsOptional()
  @IsBoolean()
  is_active?: boolean;
}
