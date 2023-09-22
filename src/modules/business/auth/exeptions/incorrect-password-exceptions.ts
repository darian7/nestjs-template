import { HttpException, HttpStatus } from '@nestjs/common';

export class IncorrectPasswordException extends HttpException {
  constructor() {
    super('incorrect password', HttpStatus.CONFLICT);
  }
}
