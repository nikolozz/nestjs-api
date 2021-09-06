import {
  Body,
  Controller,
  Delete,
  Get,
  Inject,
  OnModuleInit,
  Param,
  Post,
  UseGuards,
} from '@nestjs/common';
import { ClientGrpc } from '@nestjs/microservices';
import { JwtAuthenticationGuard } from '../authentication/guards/jwtAuthentication.guard';
import { SUBSCRIBERS_PACKAGE_TOKEN } from './constants';
import { CreateSubscriberDto } from './dto/createSubscriber.dto';
import SubscribersService from './interface/subscirbersService.interface';

@Controller('subscribers')
export class SubscribersController implements OnModuleInit {
  private subscribersService: SubscribersService;

  @Inject(SUBSCRIBERS_PACKAGE_TOKEN)
  private client: ClientGrpc;

  onModuleInit() {
    this.subscribersService = this.client.getService<SubscribersService>(
      'SubscribersService',
    );
  }

  @Get()
  @UseGuards(JwtAuthenticationGuard)
  getAllSubscribers() {
    return this.subscribersService.getAllSubscribers({});
  }

  @Post()
  @UseGuards(JwtAuthenticationGuard)
  createSubscriber(@Body() createSubscriber: CreateSubscriberDto) {
    return this.subscribersService.addSubscriber(createSubscriber);
  }

  @Delete(':id')
  @UseGuards(JwtAuthenticationGuard)
  removeSubscriber(@Param('id') subscriberId: number) {
    return this.subscribersService.removeSubscriber({ id: subscriberId });
  }
}
