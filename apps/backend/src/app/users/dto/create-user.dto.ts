import { IsString, IsEmail, IsNotEmpty, IsEnum, IsOptional } from 'class-validator';
import { MusicPlatforms } from 'constants/enums';

export class CreateUserDto {
  @IsNotEmpty()
  third_party_user_id: string;

  @IsEnum(MusicPlatforms)
  @IsNotEmpty()
  third_party_provider: MusicPlatforms;

  @IsString()
  @IsNotEmpty()
  username: string;

  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsString()
  @IsNotEmpty()
  refresh_token: string;

  @IsOptional()
  @IsString()
  profile_url?: string;

  @IsOptional()
  @IsString()
  avatar_url?: string;

  @IsOptional()
  @IsString()
  country?: string;

  @IsOptional()
  @IsString()
  ip_address?: string;
}
