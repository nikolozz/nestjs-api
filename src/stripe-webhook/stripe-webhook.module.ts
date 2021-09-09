import { Module } from '@nestjs/common';
import { StripeWebhookController } from './stripe-webhook.controller';
import { StripeModule } from '../stripe/stripe.module';
import { StripeWebhookService } from './stripe-webhook.service';
import { StripeWebhookRepository } from './stripe-webhook.repository';

@Module({
  imports: [StripeModule],
  controllers: [StripeWebhookController],
  providers: [StripeWebhookService, StripeWebhookRepository],
})
export class StripeWebhookModule {}
