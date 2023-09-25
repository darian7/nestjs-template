import {
  Controller,
  Delete,
  Get,
  Param,
  Request,
  UseGuards,
} from '@nestjs/common';

import { UsersService } from '../services/users.service';
import { JwtAuthGuard } from '../../../../common/guards/jwt-auth/jwt-auth.guard';
import { RequestUserJwtAuthGuard } from '../../auth/interfaces/auth.interface';
import { UserRoleEnum } from '../enums/user-role.enum';
import { RolesGuard } from '../../../../common/guards/roles/roles.guard';
import { Roles } from '../../../../common/decorators/roles/roles.decorator';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Roles(UserRoleEnum.CLIENT)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Get('find-one')
  getUser(@Request() req: RequestUserJwtAuthGuard) {
    return this.usersService.getUserByEmail(req.user.email);
  }

  @Roles(UserRoleEnum.ADMIN)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Get('find-many')
  getUsers() {
    return this.usersService.getUsers();
  }

  @Roles(UserRoleEnum.ADMIN)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @UseGuards(JwtAuthGuard)
  @Delete(':email')
  deleteByUserEmail(@Param('email') email: string) {
    return this.usersService.deleteUser(email);
  }
}
