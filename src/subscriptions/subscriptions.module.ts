import { Module } from '@nestjs/common';
import { SubscriptionsService } from './subscriptions.service';
import { SubscriptionsController } from './subscriptions.controller';
import { StripeModule } from '../stripe/stripe.module';

@Module({
  imports: [StripeModule],
  providers: [SubscriptionsService],
  controllers: [SubscriptionsController],
})
export class SubscriptionsModule {}
