import { Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class EmailPasswordAuthGuard extends AuthGuard('email-password') {}
