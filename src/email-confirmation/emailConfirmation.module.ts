import { Module } from '@nestjs/common';
import { EmailConfirmationService } from './emailConfirmation.service';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule } from '@nestjs/config';
import { EmailModule } from '../email/email.module';
import { EmailConfirmationController } from './emailConfirmation.controller';
import { UsersModule } from '../users/users.module';

@Module({
  imports: [JwtModule.register({}), ConfigModule, EmailModule, UsersModule],
  providers: [EmailConfirmationService],
  exports: [EmailConfirmationService],
  controllers: [EmailConfirmationController],
})
export class EmailConfirmationModule {}
