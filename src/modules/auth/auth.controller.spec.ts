import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { MongooseModule } from '@nestjs/mongoose';
import { Test, TestingModule } from '@nestjs/testing';

import mockResponse from 'src/shared/utils/mocks/reponse';
import mockedConfigService from 'src/shared/utils/mocks/config.service';
import mockedJwtService from 'src/shared/utils/mocks/jwt.service';
import {
  User,
  UserSchema,
} from 'src/shared/infra/database/schemas/user.schema';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';

describe('AuthController', () => {
  let controller: AuthController;
  let module: TestingModule;
  beforeAll(async () => {
    module = await Test.createTestingModule({
      controllers: [AuthController],
      imports: [
        MongooseModule.forRootAsync({
          imports: [ConfigModule],
          useFactory: async (configService: ConfigService) => ({
            uri: configService.get('MONGO_URL'),
            useNewUrlParser: true,
            useUnifiedTopology: true,
            useCreateIndex: true,
            useFindAndModify: false,
          }),
          inject: [ConfigService],
        }),
        MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
      ],
      providers: [
        AuthService,
        {
          provide: ConfigService,
          useValue: mockedConfigService,
        },
        {
          provide: JwtService,
          useValue: mockedJwtService,
        },
        User,
      ],
    }).compile();
    controller = module.get<AuthController>(AuthController);
  });
  afterAll(async () => {
    module.close();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
  it('should create an user', async () => {
    const user = await controller.create({
      email: 'teste@mail.com',
      name: 'teste',
      password: '123456',
    });
    expect(user).toHaveProperty('_id');
  });
  it('should authenticate an user', async () => {
    const auth = await controller.login(mockResponse, {
      email: 'teste@mail.com',
      password: '123456',
    });
    expect(auth.user).toHaveProperty('_id');
    expect(auth.token).toHaveProperty('access_token');
    expect(auth.token.access_token).toBe('token');
  });
  it('should not authenticate an user with invalid credentials', async () => {
    const auth = await controller.login(mockResponse, {
      email: 'teste@mail.com',
      password: '',
    });
    expect(auth.statusCode).toBe(401);
  });
});
