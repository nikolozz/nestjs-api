import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import User from './entities/user.entity';
import { Repository } from 'typeorm';
import { CreateUserDto } from './dto/createUser.dto';
import { UpdateUserDto } from './dto/updateUser.dto';
import * as bcrypt from 'bcrypt';

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
    throw new NotFoundException(email);
  }

  async getById(userId: number) {
    const user = await this.usersRepository.findOne(userId);
    if (user) {
      return user;
    }
    throw new NotFoundException(userId);
  }

  getAllPrivateFiles(userId: number) {
    return this.usersRepository.findOne(userId, { relations: ['files'] });
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

  async setJwtRefreshToken(userId: number, token: string) {
    const hashedToken = await bcrypt.hash(token, 10);
    await this.usersRepository.update(userId, {
      currentHashedRefreshToken: hashedToken,
    });
  }

  removeJwtRefreshToken(userId: number) {
    return this.usersRepository.update(userId, {
      currentHashedRefreshToken: null,
    });
  }
}
