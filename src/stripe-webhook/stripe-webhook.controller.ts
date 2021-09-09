import {
  Controller,
  Post,
  Headers,
  Req,
  BadRequestException,
} from '@nestjs/common';
import { StripeService } from '../stripe/stripe.service';
import { RequestWithRawBody } from './interfaces/requestWithRawBody.interface';
import { StripeWebhookService } from './stripe-webhook.service';

@Controller('webhook')
export class StripeWebhookController {
  constructor(
    private readonly stripeService: StripeService,
    private readonly stripeWebhookService: StripeWebhookService,
  ) {}

  @Post()
  async handleIncomingEvents(
    @Headers('stripe-signature') signature: string,
    @Req() request: RequestWithRawBody,
  ) {
    if (!signature) {
      throw new BadRequestException('Missing stripe-signature header');
    }
    const event = await this.stripeService.constructEventFromPayload(
      signature,
      request.rawBody,
    );
    await this.stripeWebhookService.handleIncomingEvent(event);
  }
}
