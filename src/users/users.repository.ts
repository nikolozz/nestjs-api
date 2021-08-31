import {
  HttpException,
  HttpStatus,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import User from './entities/user.entity';
import { Repository } from 'typeorm';
import { CreateUserDto } from './dto/createUser.dto';
import { UpdateUserDto } from './dto/updateUser.dto';

@Injectable()
export class UsersRepository {
  constructor(
    @InjectRepository(User) private readonly usersRepository: Repository<User>,
  ) {}

  async getByEmail(email: string) {
    const user = await this.usersRepository.findOne({ email });
    if (user) {
      return user;
    }
    throw new HttpException(
      'User with this email does not exist',
      HttpStatus.NOT_FOUND,
    );
  }

  async getById(userId: number) {
    const user = await this.usersRepository.findOne(userId);
    if (user) {
      return user;
    }
    throw new HttpException(
      'User with this email does not exist',
      HttpStatus.NOT_FOUND,
    );
  }

  async create(userData: CreateUserDto) {
    const newUser = await this.usersRepository.create(userData);
    await this.usersRepository.save(newUser);
    return newUser;
  }

  async update(userId: number, userData: UpdateUserDto) {
    await this.usersRepository.update(userId, userData);
    const updatedUser = await this.getById(userId);
    if (!updatedUser) {
      throw new NotFoundException(userId);
    }
    return updatedUser;
  }

  async addAvatar(userId: number, avatar: { key: string; url: string }) {
    const user = await this.getById(userId);
    await this.usersRepository.update(userId, { ...user, avatar });
  }
}
