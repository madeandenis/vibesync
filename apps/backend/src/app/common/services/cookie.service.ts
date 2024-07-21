import { Injectable } from '@nestjs/common';
import { Response, Request } from 'express';

@Injectable()
class CookieService {
  sendCookie(res: Response, cookieName: string, token: string, maxAge: number): void {
    res.cookie(cookieName, token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'PRODUCTION',
      sameSite: process.env.NODE_ENV === 'PRODUCTION' ? 'strict' : 'lax', 
      maxAge: maxAge * 1000, // ms
    });
  }

  getCookie(req: Request, cookieName: string): string | undefined {
    return req.cookies[cookieName];
  }

  deleteCookie(res: Response, cookieName: string): void {
    res.clearCookie(cookieName, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'PRODUCTION',
      sameSite: process.env.NODE_ENV === 'PRODUCTION' ? 'strict' : 'lax', 
    });
  }

  checkCookie(req: Request, cookieName: string): boolean {
    return req.cookies[cookieName] !== undefined;
  }
}

export default CookieService;