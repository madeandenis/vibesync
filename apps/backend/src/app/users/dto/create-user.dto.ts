import { IsString, IsEmail, IsNotEmpty, IsEnum, IsOptional } from 'class-validator';
import { SongPlatforms } from '../entities/user.entity';

export class CreateUserDto {
  @IsNotEmpty()
  third_party_user_id: number;

  @IsEnum(SongPlatforms)
  @IsNotEmpty()
  third_party_provider: SongPlatforms;

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
