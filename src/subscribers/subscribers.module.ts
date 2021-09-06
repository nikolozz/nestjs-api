import { Module } from '@nestjs/common';
import { ClientProxyFactory, Transport } from '@nestjs/microservices';
import { SubscribersController } from './subscribers.controller';
import { ConfigService, ConfigModule } from '@nestjs/config';
import { SUBSCRIBERS_PACKAGE_TOKEN } from './constants';
import { join } from 'path';

@Module({
  imports: [ConfigModule],
  providers: [
    {
      provide: SUBSCRIBERS_PACKAGE_TOKEN,
      useFactory: (configService: ConfigService) =>
        ClientProxyFactory.create({
          transport: Transport.GRPC,
          options: {
            package: 'subscribers',
            protoPath: join(__dirname, 'src/subscribers/subscribers.proto'),
            url: configService.get('GRPC_CONNECTION_URL'),
          },
        }),
      inject: [ConfigService],
    },
  ],
  controllers: [SubscribersController],
})
export class SubscribersModule {}
