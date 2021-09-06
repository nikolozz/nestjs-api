import { Module } from '@nestjs/common';
import { ClientProxyFactory, Transport } from '@nestjs/microservices';
import { SubscribersController } from './subscribers.controller';
import { ConfigService, ConfigModule } from '@nestjs/config';
import { SUBSCRIBERS_SERVICE_TOKEN } from './constants';

@Module({
  imports: [ConfigModule],
  providers: [
    {
      provide: SUBSCRIBERS_SERVICE_TOKEN,
      useFactory: (configService: ConfigService) =>
        ClientProxyFactory.create({
          transport: Transport.TCP,
          options: {
            host: configService.get('SUBSCRIBERS_SERVICE_HOST'),
            port: configService.get('SUBSCRIBERS_SERVICE_PORT'),
          },
        }),
      inject: [ConfigService],
    },
  ],
  controllers: [SubscribersController],
})
export class SubscribersModule {}
