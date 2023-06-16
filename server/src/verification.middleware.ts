import { HttpException, HttpStatus } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';

export function verify(req: Request, res: Response, next: NextFunction) {
  if (['localhost', 'ntp.guru'].includes(req.hostname)) {
    next();
  } else {
    throw new HttpException(
      `Invalid referer: ${req.headers.referer}`,
      HttpStatus.UNAUTHORIZED,
    );
  }
}
