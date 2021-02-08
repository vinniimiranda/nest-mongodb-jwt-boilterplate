import { Controller, Get, UseGuards } from '@nestjs/common';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { JwtAuthGuard } from '../auth/jwt.auth-guard';

import {
  User,
  UserDocument,
} from 'src/shared/infra/database/schemas/user.schema';

@Controller('users')
export class UsersController {
  constructor(@InjectModel(User.name) private userModel: Model<UserDocument>) {}

  @UseGuards(JwtAuthGuard)
  @Get('/')
  async index(): Promise<User[]> {
    return this.userModel.find();
  }
}
