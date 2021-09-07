import { Injectable } from '@nestjs/common';
import { SchedulerRegistry } from '@nestjs/schedule';
import { CronJob } from 'cron';
import { EmailScheduleDto } from './dto/emailSchedule.dto';
import { EmailService } from './email.service';

@Injectable()
export class EmailSchedulingService {
  constructor(
    private readonly emailService: EmailService,
    private readonly schedulerRegistry: SchedulerRegistry,
  ) {}

  scheduleEmail(email: EmailScheduleDto) {
    const job = new CronJob(new Date(), () => {
      return this.emailService.sendMail({
        to: email.recipient,
        subject: email.subject,
        text: email.content,
      });
    });
    this.schedulerRegistry.addCronJob(`${Date.now()}-${email.subject}`, job);
    job.start();
  }
}
