import { MusicPlatforms } from 'constants/enums';
import { Profile as SpotifyProfile } from 'passport-spotify';
import { MusicPlatformAuthDto } from './base.dto';

export interface SpotifyAuthDto extends MusicPlatformAuthDto {
  platform: MusicPlatforms.SPOTIFY;
  profile: SpotifyProfile; 
}
