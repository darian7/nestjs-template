import { HttpException, HttpStatus } from '@nestjs/common';

export class UserExistsException extends HttpException {
  constructor() {
    super('user already exists', HttpStatus.CONFLICT);
  }
}
