import { MusicPlatforms } from "constants/enums";

export interface MusicPlatformAuthDto {
  platform: MusicPlatforms;
  accessToken: string;
  expiresIn: number;
  refreshToken: string;
  profile: any; 
}
