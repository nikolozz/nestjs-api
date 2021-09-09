import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import StripeEvent from './entities/stripeEvent.entity';
import { Repository } from 'typeorm';

@Injectable()
export class StripeWebhookRepository {
  constructor(
    @InjectRepository(StripeEvent)
    private readonly stripeEventRepository: Repository<StripeEvent>,
  ) {}

  createEvent(id: string) {
    return this.stripeEventRepository.insert({ id });
  }
}
