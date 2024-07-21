import { Injectable, UnauthorizedException } from '@nestjs/common';
import { AppConfig } from 'config';
import * as jwt from 'jsonwebtoken';

const jwtSecret = AppConfig.auth.jwtSecret;

@Injectable()
class JwtService {
    
  generateJwt(payload: any): string {
    return jwt.sign(payload, jwtSecret);
  }

  verifyJwt(token: string): any {
    try {
      return jwt.verify(token, jwtSecret);
    } catch (error) {
      if (error instanceof jwt.JsonWebTokenError || error instanceof jwt.NotBeforeError || error instanceof jwt.TokenExpiredError) {
        throw new UnauthorizedException('Invalid or expired token.');
      } else {
        throw error;
      }
    }
  }
}

export default JwtService;
