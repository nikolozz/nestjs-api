import { Controller, Get, Post, Req, UseGuards } from '@nestjs/common';
import { SubscriptionsService } from './subscriptions.service';
import JwtTwoFactorGuard from '../authentication/guards/jwtTwoFactorAuthentication.guard';
import RequestWithUser from '../authentication/interfaces/requestWIthUser.interface';
import { PhoneNumberVerifiedGuard } from '../authentication/guards/phoneConfirmation.guard';

@Controller('subscriptions')
export class SubscriptionsController {
  constructor(private readonly subscriptionsService: SubscriptionsService) {}

  @Post('monthly')
  @UseGuards(PhoneNumberVerifiedGuard)
  @UseGuards(JwtTwoFactorGuard)
  async createMonthlySubscription(@Req() request: RequestWithUser) {
    return this.subscriptionsService.createMonthlySubscription(
      request.user.stripeCustomerId,
    );
  }

  @Get('monthly')
  @UseGuards(PhoneNumberVerifiedGuard)
  @UseGuards(JwtTwoFactorGuard)
  async getMonthlySubscription(@Req() request: RequestWithUser) {
    return this.subscriptionsService.getMonthlySubscription(
      request.user.stripeCustomerId,
    );
  }
}
