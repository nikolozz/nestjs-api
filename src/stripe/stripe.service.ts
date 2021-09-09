import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import Stripe from 'stripe';
import { PaymentMethodEnum } from './enums/paymentMethod.enum';

@Injectable()
export class StripeService {
  private readonly stripe: Stripe;

  constructor(private readonly configService: ConfigService) {
    this.stripe = new Stripe(configService.get('STRIPE_SECRET_KEY'), {
      apiVersion: '2020-08-27',
    });
  }

  createCustomer(name: string, email: string) {
    return this.stripe.customers.create({ name, email });
  }

  charge(amount: number, paymentMethodId: string, customerId: string) {
    return this.stripe.paymentIntents.create({
      amount,
      customer: customerId,
      payment_method: paymentMethodId,
      currency: this.configService.get('STRIPE_CURRENCY'),
      confirm: true,
      off_session: true,
    });
  }

  attachCreditCard(paymentMethodId: string, customerId: string) {
    return this.stripe.setupIntents.create({
      payment_method: paymentMethodId,
      customer: customerId,
    });
  }

  listCreditCards(customerId: string) {
    return this.stripe.paymentMethods.list({
      customer: customerId,
      type: PaymentMethodEnum.Card,
    });
  }
}
