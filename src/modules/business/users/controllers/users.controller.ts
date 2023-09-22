import {
  Controller,
  Delete,
  Get,
  Param,
  Request,
  UseGuards,
} from '@nestjs/common';

import { UsersService } from '../services/users.service';
import { JwtAuthGuard } from '../../../../guards/jwt-auth/jwt-auth.guard';
import { RequestUserJwtAuthGuard } from '../../auth/interfaces/auth.interface';
import { Roles } from '../../../../decorators/roles/roles.decorator';
import { UserRoleEnum } from '../enums/user-role.enum';
import { RolesGuard } from '../../../../guards/roles/roles.guard';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Roles(UserRoleEnum.CLIENT)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Get('find-one')
  getProfile(@Request() req: RequestUserJwtAuthGuard) {
    return this.usersService.getUserByEmail(req.user.email);
  }

  @Roles(UserRoleEnum.ADMIN)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Get('find-many')
  getProfiles() {
    return this.usersService.getUsers();
  }

  @Roles(UserRoleEnum.ADMIN)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @UseGuards(JwtAuthGuard)
  @Delete(':email')
  deleteByUserId(@Param('email') email: string) {
    return this.usersService.deleteUser(email);
  }
}
