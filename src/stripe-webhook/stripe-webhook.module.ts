import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { StripeWebhookController } from './stripe-webhook.controller';
import { StripeModule } from '../stripe/stripe.module';
import { StripeWebhookService } from './stripe-webhook.service';
import { StripeWebhookRepository } from './stripe-webhook.repository';
import { UsersModule } from '../users/users.module';
import StripeEvent from './entities/stripeEvent.entity';

@Module({
  imports: [TypeOrmModule.forFeature([StripeEvent]), StripeModule, UsersModule],
  controllers: [StripeWebhookController],
  providers: [StripeWebhookService, StripeWebhookRepository],
})
export class StripeWebhookModule {}
