import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersRepository } from './users.repository';
import { TypeOrmModule } from '@nestjs/typeorm';
import User from './entities/user.entity';
import Address from './entities/adress.entity';

@Module({
  imports: [TypeOrmModule.forFeature([User, Address])],
  providers: [UsersService, UsersRepository],
  exports: [UsersService],
})
export class UsersModule {}
