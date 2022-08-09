import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import * as bcrypt from 'bcrypt';
import { plainToInstance } from 'class-transformer';
import { User } from '../users/entities/user.entity';
import { AuthLoginDto } from './dtos/auth-login.dto';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    private readonly _usersService: UsersService,
    private readonly _jwtService: JwtService,
  ) {}

  async validateUser(authLoginDto: AuthLoginDto): Promise<any> {
    const { username, password: pass } = authLoginDto;
    const user = await this._usersService.findOneByUsername(username);

    if (!user) throw new UnauthorizedException('Invalid credentials');

    const isMatch = await bcrypt.compare(pass, user.password);

    if (!isMatch) throw new UnauthorizedException('Invalid credentials');

    return plainToInstance(User, user);
    //return user;
  }

  generateToken(user: any) {
    console.log(user);
    const accessToken = this._jwtService.sign({
      sub: user.id,
      role: user.role.id,
    });

    return { access_token: accessToken };
  }
}
