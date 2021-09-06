import {
  Body,
  Controller,
  Delete,
  Get,
  Inject,
  Param,
  Post,
  UseGuards,
} from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { JwtAuthenticationGuard } from '../authentication/guards/jwtAuthentication.guard';
import { SUBSCRIBERS_SERVICE_TOKEN } from './constants';
import { CreateSubscriberDto } from './dto/createSubscriber.dto';

@Controller('subscribers')
export class SubscribersController {
  @Inject(SUBSCRIBERS_SERVICE_TOKEN)
  private subscribersService: ClientProxy;

  @Get()
  @UseGuards(JwtAuthenticationGuard)
  getAllSubscribers() {
    return this.subscribersService.send('get-all-subscribers', '');
  }

  @Post()
  @UseGuards(JwtAuthenticationGuard)
  createSubscriber(@Body() createSubscriber: CreateSubscriberDto) {
    return this.subscribersService.emit('create-subscriber', createSubscriber);
  }

  @Delete(':id')
  @UseGuards(JwtAuthenticationGuard)
  removeSubscriber(@Param('id') subscriberId: number) {
    return this.subscribersService.send('remove-subsriber', subscriberId);
  }
}
