import { Injectable } from '@nestjs/common';
import { UsersRepository } from './users.repository';
import { CreateUserDto } from './dto/createUser.dto';

@Injectable()
export class UsersService {
  constructor(private readonly usersRepository: UsersRepository) {}

  getByEmail(email: string) {
    return this.usersRepository.getByEmail(email);
  }

  getById(userId: number) {
    return this.usersRepository.getById(userId);
  }

  create(createUserData: CreateUserDto) {
    return this.usersRepository.create(createUserData);
  }
}
