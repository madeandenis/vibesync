import { Injectable, ExecutionContext, UnauthorizedException, InternalServerErrorException, Logger } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Request } from 'express';
import { UserContextCookieName } from 'constants/constants';
import JwtService from '../../common/services/jwt.service';
import CookieService from '../../common/services/cookie.service';


@Injectable()
class JwtGuard extends AuthGuard('jwt') {

  private readonly logger = new Logger(JwtGuard.name);
  
  constructor(
    private readonly jwtService: JwtService,
    private readonly cookieService: CookieService
  ) {
    super();
  }

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const ctx = context.switchToHttp();
    const request = ctx.getRequest<Request>();

    const token = this.cookieService.getCookie(request, UserContextCookieName);
    if (!token) {
      throw new UnauthorizedException('Authentication token is missing.');
    }

    try {
      const payload = await this.jwtService.verifyJwt(token);
      request.user = payload;

      return true;

    } catch (error) {
      this.logger.error('JWT verification failed:', error);
      if (error instanceof UnauthorizedException) {
        throw new UnauthorizedException('Invalid token.');
      } else {
        throw new InternalServerErrorException('Error verifying token.');
      }
    }
  }

}

export default JwtGuard;