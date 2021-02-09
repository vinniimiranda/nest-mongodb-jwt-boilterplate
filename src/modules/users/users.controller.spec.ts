import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { Test, TestingModule } from '@nestjs/testing';
import {
  User,
  UserSchema,
} from 'src/shared/infra/database/schemas/user.schema';
import mockedConfigService from 'src/shared/utils/mocks/config.service';
import { UsersController } from './users.controller';

describe('UsersController', () => {
  let controller: UsersController;
  let module: TestingModule;
  beforeAll(async () => {
    module = await Test.createTestingModule({
      controllers: [UsersController],
      imports: [
        MongooseModule.forRootAsync({
          imports: [ConfigModule],
          useFactory: async (configService: ConfigService) => ({
            uri: 'mongodb://localhost/quiz',
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
        {
          provide: ConfigService,
          useValue: mockedConfigService,
        },

        User,
      ],
    }).compile();
    controller = module.get<UsersController>(UsersController);
  });
  afterAll(async () => {
    module.close();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
  it('should return all users', async () => {
    const users = await controller.index();
    expect(users).toBeInstanceOf(Array);
    users.forEach((user) => {
      expect(user).toHaveProperty('_id');
    });
  });
});
