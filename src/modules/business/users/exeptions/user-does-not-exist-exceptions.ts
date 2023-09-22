import { HttpException, HttpStatus } from '@nestjs/common';

export class UserDoesNotExistException extends HttpException {
  constructor() {
    super('user does not exist', HttpStatus.CONFLICT);
  }
}
