import { Test, TestingModule } from '@nestjs/testing';
import { CreateUserDto } from './dto/createUser.dto';
import { UsersService } from './users.service';

describe('UsersService', () => {
  let service: UsersService;
  const apiService = {
    getByEmail(email: string) {
      return [] as unknown;
    },

    getById(userId: number) {
      return [] as unknown;
    },

    create(createUserData: CreateUserDto) {
      return [] as unknown;
    },
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [UsersService],
    })
      .overrideProvider(UsersService)
      .useValue(apiService)
      .compile();

    service = module.get<UsersService>(UsersService);
  });

  it('should call getByEmail with expected params', () => {
    const email = 'test@test.com';
    const getByEmailMock = jest.spyOn(service, 'getByEmail');
    service.getByEmail(email);
    expect(getByEmailMock).toBeCalledWith(email);
  });

  it('should call getById with expected params', () => {
    const userId = 1;
    const getByIdMock = jest.spyOn(service, 'getById');
    service.getById(userId);
    expect(getByIdMock).toBeCalledWith(userId);
  });

  it('should call create with expected params', () => {
    const createUser = new CreateUserDto();
    const createMock = jest.spyOn(service, 'create');
    service.create(createUser);
    expect(createMock).toBeCalledWith(createUser);
  });
});
