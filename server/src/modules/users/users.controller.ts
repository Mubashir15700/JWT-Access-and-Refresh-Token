import { Controller, Get, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt.guard';

@Controller('users')
@UseGuards(JwtAuthGuard)
export class UsersController {
  constructor() {}

  @Get('profile')
  getProfile() {
    return { message: 'This is a protected route' };
  }
}
