import { Injectable, InternalServerErrorException, HttpException, HttpStatus, Logger } from '@nestjs/common';
import { Request, Response } from 'express';
import { AppConfig } from 'config';
import { UserContext } from 'typings/user.type';
import { UserContextCookieName } from 'constants/constants';
import CookieService from '../../common/services/cookie.service';
import UsersService from '../../users/users.service';
import JwtService from '../../common/services/jwt.service';
import CryptoService from '../../common/services/crypto.service';

@Injectable()
export class SpotifyAuthService {
  private readonly logger = new Logger(SpotifyAuthService.name);

  constructor(
    private readonly userService: UsersService,
    private readonly jwtService: JwtService,
    private readonly cookieService: CookieService,
    private readonly cryptoService: CryptoService
  ) {}

  private handleInvalidUserContext(userContext: UserContext, req: Request): void {
    const userId = userContext?.userIdentity?.id;
    this.logger.log(`Checking user context for user ID: ${userId} at ${req.url}`);
    if (!userContext) {
      this.logger.error(`UserContext setup failed for user ID: ${userId} at ${req.url}`);
      throw new InternalServerErrorException('UserContext setup failed.');
    }
    this.logger.log(`UserContext validated successfully for user ID: ${userId}`);
  }

  private generateJwt(userContext: UserContext): string {
    const userId = userContext?.userIdentity?.id;
    this.logger.log(`Generating JWT for user ID: ${userId}`);
    try {
      const token = this.jwtService.generateJwt(userContext);
      this.logger.log(`JWT generated successfully for user ID: ${userId}`);
      return token;
    } catch (error) {
      this.logger.error(`Error generating JWT for user ID: ${userId}: ${error.message}`, error.stack);
      throw new InternalServerErrorException('Failed to generate JWT token.');
    }
  }

  private sendCookie(res: Response, token: string, expiresIn: number): void {
    this.logger.log('Sending authentication cookie');
    try {
      this.cookieService.sendCookie(res, UserContextCookieName, token, expiresIn);
      this.logger.log('Cookie sent successfully');
    } catch (error) {
      this.logger.error('Error setting cookie:', error.message, error.stack);
      throw new InternalServerErrorException('Failed to set authentication cookie.');
    }
  }

  async handleSpotifyCallback(req: Request, res: Response) {
    this.logger.log('Handling Spotify callback');
    const userContext: UserContext = req.user as UserContext;

    this.handleInvalidUserContext(userContext, req);

    const token = this.generateJwt(userContext);
    this.sendCookie(res, token, userContext.authenticationDetails.expires_in);

    this.logger.log('Spotify callback handled successfully for user ID: ' + userContext.userIdentity.id);
    return res.status(HttpStatus.OK).send('Successfully authenticated');
  }

  async handleSpotifyRefreshToken(req: Request, res: Response) {
    this.logger.log('Handling Spotify refresh token');
    const userContext: UserContext = req.user as UserContext;

    this.handleInvalidUserContext(userContext, req);

    const refreshToken = await this.fetchRefreshTokenFromDb(userContext);
    this.logger.log('Fetched refresh token from DB for user ID: ' + userContext.userIdentity.id);

    const newAccessToken = await this.fetchAccessTokenFromSpotifyApi(refreshToken);
    this.logger.log('Fetched new access token from Spotify API for user ID: ' + userContext.userIdentity.id);

    userContext.authenticationDetails.access_token = newAccessToken;

    const token = this.generateJwt(userContext);
    this.sendCookie(res, token, userContext.authenticationDetails.expires_in);

    this.logger.log('Spotify refresh token handled successfully for user ID: ' + userContext.userIdentity.id);
    return res.status(HttpStatus.OK).send('Access token refreshed successfully');
  }

  private async fetchRefreshTokenFromDb(userContext: UserContext): Promise<string> {
    const userId = userContext.userIdentity.id;
    this.logger.log(`Fetching refresh token from DB for user ID: ${userId}`);
    try {
      const user = await this.userService.findOne(userId);
      if (!user) {
        this.logger.error(`Fetching refresh token failed: user with ID ${userId} not found`);
        throw new InternalServerErrorException('User not found.');
      }
      const encryptedRefreshToken = user.refresh_token;
      const decryptedRefreshToken = this.cryptoService.decrypt(encryptedRefreshToken);
      this.logger.log(`Refresh token decrypted successfully for user ID: ${userId}`);
      return decryptedRefreshToken;
    } catch (error) {
      this.logger.error(`Error fetching refresh token for user ID ${userId}: ${error.message}`, error.stack);
      throw new InternalServerErrorException('Error fetching refresh token.');
    }
  }

  private async fetchAccessTokenFromSpotifyApi(refreshToken: string): Promise<string> {
    this.logger.log('Fetching access token from Spotify API');
    const spotifyApiToken = 'https://accounts.spotify.com/api/token';

    const payload = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        Authorization: `Basic ${Buffer.from(`${AppConfig.general.spotify.clientId}:${AppConfig.general.spotify.secretId}`).toString('base64')}`,
      },
      body: new URLSearchParams({
        grant_type: 'refresh_token',
        refresh_token: refreshToken,
      }),
    };

    try {
      const response = await fetch(spotifyApiToken, payload);
      if (!response.ok) {
        this.logger.error(`Spotify token refresh failed with status: ${response.status}`);
        throw new HttpException(`Spotify token refresh failed`, response.status);
      }
      const body = await response.json();
      this.logger.log('Access token fetched from Spotify API successfully');
      return body.access_token;
    } catch (error) {
      this.logger.error('Error fetching access token from Spotify API:', error.message, error.stack);
      throw new InternalServerErrorException('Error fetching access token from Spotify API.');
    }
  }
}
