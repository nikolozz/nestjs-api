import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersRepository } from './users.repository';
import { TypeOrmModule } from '@nestjs/typeorm';
import User from './entities/user.entity';
import Address from './entities/adress.entity';
import { FilesModule } from '../files/files.module';
import { UsersController } from './users.controller';
import { StripeModule } from '../stripe/stripe.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([User, Address]),
    FilesModule,
    StripeModule,
  ],
  providers: [UsersService, UsersRepository],
  exports: [UsersService],
  controllers: [UsersController],
})
export class UsersModule {}
