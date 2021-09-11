import { Controller, Get, Post, Query, Req, UseGuards } from '@nestjs/common';
import { EmailConfirmationService } from './emailConfirmation.service';
import RequestWithUser from '../authentication/interfaces/requestWIthUser.interface';
import { JwtAuthenticationGuard } from '../authentication/guards/jwtAuthentication.guard';

@Controller('verify-email')
export class EmailConfirmationController {
  constructor(
    private readonly emailConfirmationService: EmailConfirmationService,
  ) {}

  @Get()
  verifyEmail(@Query('token') token: string) {
    return this.emailConfirmationService.verifyEmail(token);
  }

  @Post('resend-confirmation-link')
  @UseGuards(JwtAuthenticationGuard)
  resendConfirmationLink(@Req() request: RequestWithUser) {
    return this.emailConfirmationService.resendVerifyEmail(request.user.id);
  }
}
