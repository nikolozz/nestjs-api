import { Module } from '@nestjs/common';
import { ChargeController } from './charge.controller';
import { StripeModule } from '../stripe/stripe.module';

@Module({
  imports: [StripeModule],
  controllers: [ChargeController],
})
export class ChargeModule {}
