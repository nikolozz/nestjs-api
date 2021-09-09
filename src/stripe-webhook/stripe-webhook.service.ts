import { BadRequestException, Injectable } from '@nestjs/common';
import Stripe from 'stripe';
import { UsersService } from '../users/users.service';
import { StripeWebhookRepository } from './stripe-webhook.repository';
import { PostgresErrorCode } from '../database/enums/postgresErrorCodes.enum';

@Injectable()
export class StripeWebhookService {
  constructor(
    private readonly stripeWebhookRepositoru: StripeWebhookRepository,
    private readonly usersService: UsersService,
  ) {}

  async handleIncomingEvent(event: Stripe.Event) {
    if (
      event.type === 'customer.subscription.updated' ||
      event.type === 'customer.subscription.created'
    ) {
      await this.processSubscriptionUpdate(event);
    }
  }

  private async processSubscriptionUpdate(event: Stripe.Event) {
    try {
      await this.stripeWebhookRepositoru.createEvent(event.id);
    } catch (error) {
      if (error?.code === PostgresErrorCode.UniqueViolation) {
        throw new BadRequestException('This event was already processed');
      }
    }
    const data = event.data.object as Stripe.Subscription;
    const customerId: string = data.customer as string;
    const subscriptionStatus = data.status;

    this.usersService.updateMonthlySubscriptionStatus(
      customerId,
      subscriptionStatus,
    );
  }
}
