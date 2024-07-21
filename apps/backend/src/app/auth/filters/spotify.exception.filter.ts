import { ExceptionFilter, Catch, ArgumentsHost, HttpException, HttpStatus, UnauthorizedException } from '@nestjs/common';
import { Request, Response } from 'express';
import { SpotifyPaths } from 'constants/enums';

@Catch(Error)
export class SpotifyExceptionFilter implements ExceptionFilter {
  catch(exception: Error, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    if ( exception instanceof UnauthorizedException || (exception.name === 'TokenError' &&
        ( 
            exception.message === 'Authorization code expired' ||
            exception.message === 'Invalid authorization code'
        )
    ))
    {
      const spotifyAuthPath = SpotifyPaths.AUTH_PATH;
      response.redirect(spotifyAuthPath);
      return;

    } else {
      const status = exception instanceof HttpException ? exception.getStatus() : HttpStatus.INTERNAL_SERVER_ERROR;
      response.status(status).json({
        statusCode: status,
        timestamp: new Date().toISOString(),
        path: request.url,
        exceptionName: exception?.name,
        message: exception.message || 'Internal server error',
      });
    }
  }
}
