import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/users.service'; 
import * as bcrypt from 'bcrypt';
import { JwtPayload } from 'src/common/interfaces/jwt-payload.interface'; 
import { LoginDto } from './dto/login.dto';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  async validateUser(email: string, pass: string) {
    const user = await this.usersService.findByEmail(email);
    if (user && await bcrypt.compare(pass, user.password)) {
      const { password, ...result } = user;
      return result;
    }
    return null;
  }

  async login(loginDto: LoginDto) {
    const { email } = loginDto;
    const fullUser = await this.usersService.findByEmail(email);
  
    if (!fullUser) {
      throw new UnauthorizedException('Invalid credentials');
    }
  
    const payload: JwtPayload = {
      id: fullUser.id,
      email: fullUser.email,
      role: fullUser.role,
    };
  
    return {
      user: {
        id: fullUser.id,
        name: fullUser.name,
        email: fullUser.email,
        role: fullUser.role,
      },
      access_token: this.jwtService.sign(payload, { expiresIn: '15m' }),
      refresh_token: this.jwtService.sign(payload, { expiresIn: '7d' }),
    };
  }  
}
