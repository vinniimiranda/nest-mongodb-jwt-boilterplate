import { Body, Controller, Post, Res } from '@nestjs/common';
import { Response } from 'express';
import { CreateUserDto } from '../../shared/dtos/create-user.dto';
import { LoginDto } from '../../shared/dtos/login.dto';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  async create(@Body() createUserDto: CreateUserDto): Promise<any> {
    return this.authService.create(createUserDto);
  }

  @Post('login')
  async login(@Res() res: Response, @Body() loginDto: LoginDto): Promise<any> {
    const user = await this.authService.login(loginDto);

    if (!user) {
      return res.status(401).json({
        statusCode: 401,
        message: 'Invalid credentials',
      });
    }

    return res.status(200).json(user);
  }
}
