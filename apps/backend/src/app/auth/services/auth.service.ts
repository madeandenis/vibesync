import { Injectable, Logger } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '../../users/entities/user.entity';
import UsersService from '../../users/users.service';
import CryptoService from '../../common/services/crypto.service';
import { MusicPlatformAuthDto } from '../dto/base.dto';

@Injectable()
export class AuthService {

  private readonly logger = new Logger(AuthService.name);

  constructor(
    @InjectRepository(User)
    private readonly usersRepository: Repository<User>,
    private readonly usersService: UsersService,
    private readonly cryptoService: CryptoService,
  ) {}

  async validateUser(musicPlatformAuthDto: MusicPlatformAuthDto, clientIp: string): Promise<User> {
    try {
      let { refreshToken, profile } = musicPlatformAuthDto;
      
      refreshToken = this.cryptoService.encrypt(refreshToken);
      this.logger.log(`Encrypted refresh token for user ${profile.id}`);
      
      let user = await this.usersService.findOneParams({
        third_party_user_id: profile.id,
        third_party_provider: profile.provider.toUpperCase(),
      });

      const userData = {
        username: profile.displayName,
        email: profile.emails ? profile.emails[0].value : null,
        refresh_token: refreshToken,
        profile_url: profile.profileUrl,
        avatar_url: profile.photos ? profile.photos[0] : null,
        country: profile.country,
        is_active: true,
        last_login: new Date(),
        ip_address: clientIp,
      };

      if (!user) {
        user = this.usersRepository.create({
          third_party_user_id: profile.id,
          third_party_provider: profile.provider.toUpperCase(),
          ...userData,
        });
        this.logger.log(`Created new user for third-party ID ${profile.id}`);
      } else {
        Object.assign(user, userData);
        this.logger.log(`Updated user for third-party ID ${profile.id}`);
      }

      const savedUser = await this.usersRepository.save(user);
      this.logger.log(`User ${savedUser.id} saved successfully`);
      return savedUser;

    } catch (error) {
      this.logger.error(`Error validating user: ${error.message}`, error.stack);
      throw new Error('Error validating user');
    }
  }
}
