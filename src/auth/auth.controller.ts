import { Body, Controller, Get, Post, Req, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthLoginDto } from './dtos/auth-login.dto';
import { AuthGuard } from '@nestjs/passport';
import { LocalGuard } from './local.guard';
import { User } from '../decorators/user.decorator';
import { JwtGuard } from './jwt.guard';

@Controller('auth')
export class AuthController {
  constructor(private readonly _authService: AuthService) {}

  @UseGuards(LocalGuard)
  @Post('login')
  login(@Body() authLoginDto: AuthLoginDto, @User() user) {
    return this._authService.generateToken(user);
  }

  @UseGuards(JwtGuard)
  @Get('me')
  me(@User() user) {
    return user;
  }
}
