// src/auth/auth.controller.ts
import { Controller, Post, UseGuards, Request, Put, Req, Body } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LocalAuthGuard } from './local-auth.guard';
import { AuthGuard } from '@nestjs/passport';
import { UsersService } from '../users/users.service';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService, private usersService: UsersService) {}

  @UseGuards(LocalAuthGuard)
  @Post('login')
  async login(@Req() req) {
    return this.authService.login(req.user);
  }

  @UseGuards(AuthGuard('jwt'))
  @Put('update-email')
  async updateEmail(@Req() req, @Body() body: { email: string }) {
    const userId = req.user.userId;
    await this.usersService.updateEmail(userId, body.email);
    return { message: 'Email updated successfully' };
  }

  @UseGuards(AuthGuard('jwt')) // Ensure user is authenticated with JWT
  @Put('change-password')
  async changePassword(
    @Req() req,
    @Body() body: { oldPassword: string, newPassword: string },
  ) {
    const userId = req.user.userId;

    // Check if the old password is valid
    const user = await this.usersService.findById(userId);
    const isPasswordValid = await this.usersService.validatePassword(body.oldPassword, user.password);

    if (!isPasswordValid) {
      throw new Error('Invalid old password');
    }

    // Update the password
    await this.usersService.updatePassword(userId, body.newPassword);
    return { message: 'Password changed successfully' };
  }
}
