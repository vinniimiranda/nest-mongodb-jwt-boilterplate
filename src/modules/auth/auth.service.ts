import { Injectable } from '@nestjs/common';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { JwtService } from '@nestjs/jwt';

import * as bcrypt from 'bcrypt';

import {
  User,
  UserDocument,
} from 'src/shared/infra/database/schemas/user.schema';
import { CreateUserDto } from 'src/shared/dtos/create-user.dto';
import { LoginDto } from 'src/shared/dtos/login.dto';

@Injectable()
export class AuthService {
  constructor(
    @InjectModel(User.name) private userModel: Model<UserDocument>,
    private jwtService: JwtService,
  ) {}

  async create({ email, name, password }: CreateUserDto): Promise<User> {
    const saltOrRounds = 10;
    const hash = await bcrypt.hash(password, saltOrRounds);
    const createdUser = new this.userModel({
      email,
      name,
      password: hash,
    });
    return createdUser.save();
  }

  async login({ email, password }: LoginDto): Promise<any> {
    const user = await this.userModel
      .findOne({ email })
      .select('+password')
      .lean();

    const isMatch = await bcrypt.compare(password, user.password);
    delete user.password;

    if (isMatch) {
      const payload = { userId: user._id };
      return {
        user,
        token: {
          access_token: this.jwtService.sign(payload),
          expiresIn: 86400,
        },
      };
    }
    return null;
  }
}
