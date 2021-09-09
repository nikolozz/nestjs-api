import { Module } from '@nestjs/common';
import { CreditCardsController } from './creditCards.controller';
import { StripeModule } from '../stripe/stripe.module';

@Module({
  imports: [StripeModule],
  controllers: [CreditCardsController],
})
export class CreditCardsModule {}
