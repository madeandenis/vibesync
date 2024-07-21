import {
  Controller,
  Get,
  Req,
  Res,
  UseFilters,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Response } from 'express';
import { SpotifyExceptionFilter } from '../filters/spotify.exception.filter';
import JwtGuard from '../guards/jwt.guard';
import { SpotifyAuthService } from '../services/spotify.auth.service';
import JwtService from '../../common/services/jwt.service';
import CookieService from '../../common/services/cookie.service';

@Controller('auth')
@UseFilters(new SpotifyExceptionFilter())
export class SpotifyAuthController {
  constructor(
    private readonly spotifyAuthService: SpotifyAuthService,
  ) {}

  @Get('spotify')
  @UseGuards(AuthGuard('spotify'))
  async spotifyAuth() {}

  @Get('spotify/callback')
  @UseGuards(AuthGuard('spotify'))
  async spotifyCallback(@Req() req, @Res() res: Response) {
    return this.spotifyAuthService.handleSpotifyCallback(req, res);
  }

  @Get('spotify/refresh-token')
  @UseGuards(new JwtGuard(new JwtService(),new CookieService()))
  async spotifyRefreshToken(@Req() req, @Res() res: Response) {
    return this.spotifyAuthService.handleSpotifyRefreshToken(req, res);
  }
}
