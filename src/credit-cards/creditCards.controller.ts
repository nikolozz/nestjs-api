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
import { EmailConfirmationGuard } from '../authentication/guards/emailConfirmation.guard';
import { PhoneNumberVerifiedGuard } from '../authentication/guards/phoneConfirmation.guard';

@Controller('credit-cards')
export class CreditCardsController {
  constructor(private readonly stripeService: StripeService) {}

  @Post()
  @UseGuards(PhoneNumberVerifiedGuard)
  @UseGuards(EmailConfirmationGuard)
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
  @UseGuards(PhoneNumberVerifiedGuard)
  @UseGuards(EmailConfirmationGuard)
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
  @UseGuards(PhoneNumberVerifiedGuard)
  @UseGuards(EmailConfirmationGuard)
  @UseGuards(JwtTwoFactorGuard)
  async getCreditCards(@Req() request: RequestWithUser) {
    return this.stripeService.listCreditCards(request.user.stripeCustomerId);
  }
}
