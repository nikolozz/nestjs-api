import { Module } from '@nestjs/common';
import { SubscriptionsService } from './subscriptions.service';
import { SubscriptionsController } from './subscriptions.controller';
import { StripeModule } from '../stripe/stripe.module';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [ConfigModule, StripeModule],
  providers: [SubscriptionsService],
  controllers: [SubscriptionsController],
})
export class SubscriptionsModule {}
