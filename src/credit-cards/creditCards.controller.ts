import { Body, Controller, Get, Post, Req, UseGuards } from '@nestjs/common';
import { StripeService } from '../stripe/stripe.service';
import { AddCreditCardDto } from './dto/createCreditCard.dto';
import JwtTwoFactorGuard from '../authentication/guards/jwtTwoFactorAuthentication.guard';
import RequestWithUser from '../authentication/interfaces/requestWIthUser.interface';

@Controller('credit-cards')
export class CreditCardsController {
  constructor(private readonly stripeService: StripeService) {}

  @Post()
  @UseGuards(JwtTwoFactorGuard)
  attachCreditCard(
    @Req() request: RequestWithUser,
    @Body() creditCard: AddCreditCardDto,
  ) {
    const { paymentMethodId } = creditCard;
    const customerId = request.user.stripeCustomerId;
    return this.stripeService.attachCreditCard(paymentMethodId, customerId);
  }

  @Get()
  @UseGuards(JwtTwoFactorGuard)
  async getCreditCards(@Req() request: RequestWithUser) {
    return this.stripeService.listCreditCards(request.user.stripeCustomerId);
  }
}
