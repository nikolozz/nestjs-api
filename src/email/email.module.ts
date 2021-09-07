import { Module } from '@nestjs/common';
import { EmailService } from './email.service';
import { ConfigModule } from '@nestjs/config';
import { EmailController } from './email.controller';
import { EmailSchedulingService } from './emailSchedule.service';

@Module({
  imports: [ConfigModule],
  providers: [EmailService, EmailSchedulingService],
  exports: [EmailService],
  controllers: [EmailController],
})
export class EmailModule {}
