import {
  Body,
  Controller,
  HttpCode,
  Post,
  Request,
  UseGuards,
} from '@nestjs/common';

import { AuthService } from '../services/auth.service';
import { EmailPasswordAuthGuard } from '../guards/email-password.guard';
import { RequestUserEmailPasswordAuthGuard } from '../interfaces/auth.interface';
import { SignupUserDto } from '../dto/auth-signup.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('signup')
  @HttpCode(200)
  async signup(@Body() input: SignupUserDto) {
    return await this.authService.signupUser(input);
  }

  @UseGuards(EmailPasswordAuthGuard)
  @Post('login')
  @HttpCode(200)
  async login(@Request() req: RequestUserEmailPasswordAuthGuard) {
    return await this.authService.signIn(req);
  }
}
