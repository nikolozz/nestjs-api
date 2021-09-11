import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import User from './entities/user.entity';
import { In, QueryRunner, Repository } from 'typeorm';
import { CreateUserDto } from './dto/createUser.dto';
import { UpdateUserDto } from './dto/updateUser.dto';
import * as bcrypt from 'bcrypt';
import { StripeService } from '../stripe/stripe.service';

@Injectable()
export class UsersRepository {
  constructor(
    @InjectRepository(User) private readonly usersRepository: Repository<User>,
    private readonly stripeService: StripeService,
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

  async getByIds(ids: number[]) {
    const users = await this.usersRepository.find({ where: { id: In(ids) } });
    if (!users.length) {
      throw new NotFoundException();
    }
    return users;
  }

  getAllPrivateFiles(userId: number) {
    return this.usersRepository.findOne(userId, { relations: ['files'] });
  }

  async create(userData: CreateUserDto) {
    const stripeCustomer = await this.stripeService.createCustomer(
      userData.name,
      userData.email,
    );
    const newUser = await this.usersRepository.create({
      ...userData,
      stripeCustomerId: stripeCustomer.id,
    });
    await this.usersRepository.save(newUser);
    return newUser;
  }

  updateMonthlySubscriptionStatus(
    stripeCustomerId: string,
    monthlySubscriptionStatus: string,
  ) {
    return this.usersRepository.update(
      { stripeCustomerId },
      { monthlySubscriptionStatus },
    );
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

  deleteAvatarWithQueryRunner(userId: number, queryRunner: QueryRunner) {
    return queryRunner.manager.update(User, userId, { avatar: null });
  }

  markEmailAsConfirmed(userId: number) {
    return this.usersRepository.update(userId, { isEmailVerified: true });
  }

  markPhoneNumberAsConfirmed(userId: number) {
    return this.usersRepository.update(userId, {
      isPhoneNumberConfirmed: true,
    });
  }

  async setJwtRefreshToken(userId: number, token: string) {
    const hashedToken = await bcrypt.hash(token, 10);
    await this.usersRepository.update(userId, {
      currentHashedRefreshToken: hashedToken,
    });
  }

  setTwoFactorAuthenticationSecret(secret: string, id: number) {
    return this.usersRepository.update(id, {
      twoFactorAuthenticationSecret: secret,
    });
  }

  turnOnTwoFactorAuthentication(id: number) {
    return this.usersRepository.update(id, {
      isTwoFactorAuthenticationEnabled: true,
    });
  }

  removeJwtRefreshToken(userId: number) {
    return this.usersRepository.update(userId, {
      currentHashedRefreshToken: null,
    });
  }
}
