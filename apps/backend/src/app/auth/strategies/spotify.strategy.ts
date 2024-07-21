import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-spotify';
import { Injectable, Logger, InternalServerErrorException } from '@nestjs/common';
import { AuthService } from '../services/auth.service';
import { SpotifyAuthDto } from '../dto/spotify.dto';
import { AppConfig } from 'config';
import { UserContext } from 'typings/user.type';
import { User } from '../../users/entities/user.entity';
import { generateUserContext } from '../../common/utils/user.util';
import { MusicPlatforms } from 'constants/enums';

@Injectable()
export class SpotifyStrategy extends PassportStrategy(Strategy, 'spotify') {

  private readonly logger = new Logger(SpotifyStrategy.name);

  constructor(private readonly authService: AuthService) {
    super({
      clientID: AppConfig.general.spotify.clientId,
      clientSecret: AppConfig.general.spotify.secretId,
      callbackURL: `${AppConfig.general.backend.baseUrl}/api/auth/spotify/callback`,
      scope: ['user-read-email', 'user-read-private'],
      passReqToCallback: true,
    }, 
    async (req, accessToken, refreshToken, expires_in, profile, done) => {
      const spotifyAuthDto: SpotifyAuthDto = {
        platform: MusicPlatforms.SPOTIFY,
        accessToken,
        expiresIn: expires_in,
        refreshToken,
        profile,
      };

      try {
        const user: User = await this.authService.validateUser(spotifyAuthDto, req.clientIp);
        const userContext: UserContext = generateUserContext(user, accessToken, expires_in);
        done(null, userContext);
      } catch (error) {
        this.logger.error('Error validating user:', error.message, error.stack);
        done(new InternalServerErrorException('Authentication failed'), null);
      }
    });
  }
}
