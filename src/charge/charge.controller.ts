import { Body, Controller, Post, Req, UseGuards } from '@nestjs/common';
import { CreateChargeDto } from './dto/createCharge.dto';
import { StripeService } from '../stripe/stripe.service';
import JwtTwoFactorGuard from '../authentication/guards/jwtTwoFactorAuthentication.guard';
import RequestWithUser from '../authentication/interfaces/requestWIthUser.interface';

@Controller('charge')
export class ChargeController {
  constructor(private readonly stripeService: StripeService) {}

  @Post()
  @UseGuards(JwtTwoFactorGuard)
  charge(@Body() chargeDto: CreateChargeDto, @Req() request: RequestWithUser) {
    return this.stripeService.charge(
      chargeDto.amount,
      chargeDto.paymentMethodId,
      request.user.stripeCustomerId,
    );
  }
}
