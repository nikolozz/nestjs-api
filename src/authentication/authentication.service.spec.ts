import { Test, TestingModule } from '@nestjs/testing';
import { AuthenticationService } from './authentication.service';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { getRepositoryToken } from '@nestjs/typeorm';
import User from '../users/entities/user.entity';
import { UsersRepository } from '../users/users.repository';

describe('AuthenticationService', () => {
  let service: AuthenticationService;
  const mockedConfigService = {
    get(key: string) {
      switch (key) {
        case 'JWT_EXPIRATION_TIME':
          return '3600';
      }
    },
  };
  const mockedJwtService = {
    sign: () => '',
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthenticationService,
        UsersService,
        UsersRepository,
        { provide: JwtService, useValue: mockedJwtService },
        { provide: ConfigService, useValue: mockedConfigService },
        {
          provide: getRepositoryToken(User),
          useValue: {},
        },
      ],
    }).compile();

    service = module.get<AuthenticationService>(AuthenticationService);
  });

  describe('jst', () => {
    it('should generate token from payload', () => {
      const userId = 1;
      const token = service.getCookieWithJwtToken(userId);
      expect(typeof token).toBe('string');
    });
  });
});
