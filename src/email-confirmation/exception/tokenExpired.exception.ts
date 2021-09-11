import { HttpException, HttpStatus } from '@nestjs/common';

export class TokenExpiredException extends HttpException {
  constructor() {
    super({ message: 'Token time is expired' }, HttpStatus.FORBIDDEN);
  }
}
