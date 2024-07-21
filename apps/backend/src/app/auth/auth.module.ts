import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthService } from './services/auth.service';
import { UsersModule } from '../users/users.module'; 
import { User } from '../users/entities/user.entity'; 
import { SpotifyAuthController } from './controllers/spotify.auth.controller';
import { SpotifyStrategy } from './strategies/spotify.strategy';
import { SpotifyAuthService } from './services/spotify.auth.service';
import UsersService from '../users/users.service';
import JwtService from '../common/services/jwt.service';
import CookieService from '../common/services/cookie.service';
import CryptoService from '../common/services/crypto.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([User]),
    UsersModule,
  ],
  providers: [
    AuthService,
    UsersService,
    JwtService,
    CookieService,
    CryptoService,
    SpotifyAuthService,
    SpotifyStrategy
  ],
  controllers: [
    SpotifyAuthController
  ], 
  exports: [AuthService],
})
export class AuthModule {}
