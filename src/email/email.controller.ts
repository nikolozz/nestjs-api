import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { EmailScheduleDto } from './dto/emailSchedule.dto';
import { JwtAuthenticationGuard } from '../authentication/guards/jwtAuthentication.guard';
import { EmailSchedulingService } from './emailSchedule.service';

@Controller('email')
export class EmailController {
  constructor(
    private readonly emailSchedulingService: EmailSchedulingService,
  ) {}

  @Post('schedule')
  @UseGuards(JwtAuthenticationGuard)
  scheduleEmail(@Body() email: EmailScheduleDto) {
    return this.emailSchedulingService.scheduleEmail(email);
  }
}
