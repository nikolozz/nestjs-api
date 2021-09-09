import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import Stripe from 'stripe';
import { PaymentMethodEnum } from './enums/paymentMethod.enum';
import { StripeError } from './enums/stripeError.enum';

@Injectable()
export class StripeService {
  private readonly stripe: Stripe;

  constructor(private readonly configService: ConfigService) {
    this.stripe = new Stripe(configService.get('STRIPE_SECRET_KEY'), {
      apiVersion: '2020-08-27',
    });
  }

  setDefaultPaymentMethod(paymentMethodId: string, customerId: string) {
    try {
      return this.stripe.customers.update(customerId, {
        invoice_settings: {
          default_payment_method: paymentMethodId,
        },
      });
    } catch (error) {
      if (error?.type === StripeError.InvalidRequest) {
        throw new BadRequestException('Wrong credit card chosen');
      }
      throw new InternalServerErrorException();
    }
  }

  createCustomer(name: string, email: string) {
    return this.stripe.customers.create({ name, email });
  }

  createSubscription(priceId: string, customerId: string) {
    try {
      return this.stripe.subscriptions.create({
        customer: customerId,
        items: [
          {
            price: priceId,
          },
        ],
        trial_period_days: 30,
      });
    } catch (error) {
      if (error?.code === StripeError.ResourceMissing) {
        throw new BadRequestException('Credit card not set up');
      }
      throw new InternalServerErrorException();
    }
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

  listSubscriptions(priceId: string, customerId: string) {
    return this.stripe.subscriptions.list({
      customer: customerId,
      price: priceId,
      expand: ['data.latest_invoice', 'data.latest_invoice.payment_intent'],
    });
  }
}
