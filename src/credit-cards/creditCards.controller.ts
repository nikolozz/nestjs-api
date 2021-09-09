import {
  Body,
  Controller,
  Get,
  HttpCode,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { StripeService } from '../stripe/stripe.service';
import { AddCreditCardDto } from './dto/createCreditCard.dto';
import { SetDefaultCreditCardDto } from './dto/setDefaultCreditCard.dto';
import JwtTwoFactorGuard from '../authentication/guards/jwtTwoFactorAuthentication.guard';
import RequestWithUser from '../authentication/interfaces/requestWIthUser.interface';

@Controller('credit-cards')
export class CreditCardsController {
  constructor(private readonly stripeService: StripeService) {}

  @Post()
  @UseGuards(JwtTwoFactorGuard)
  attachCreditCard(
    @Req() request: RequestWithUser,
    @Body() { paymentMethodId }: AddCreditCardDto,
  ) {
    const customerId = request.user.stripeCustomerId;
    return this.stripeService.attachCreditCard(paymentMethodId, customerId);
  }

  @Post('default')
  @HttpCode(200)
  @UseGuards(JwtTwoFactorGuard)
  setDefaultCreditCard(
    @Req() request: RequestWithUser,
    { paymentMethodId }: SetDefaultCreditCardDto,
  ) {
    return this.stripeService.setDefaultPaymentMethod(
      paymentMethodId,
      request.user.stripeCustomerId,
    );
  }

  @Get()
  @UseGuards(JwtTwoFactorGuard)
  async getCreditCards(@Req() request: RequestWithUser) {
    return this.stripeService.listCreditCards(request.user.stripeCustomerId);
  }
}
