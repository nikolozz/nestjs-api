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
      useFactory: (configService: ConfigService) => {
        const user = configService.get('RABBITMQ_USER');
        const password = configService.get('RABBITMQ_PASSWORD');
        const host = configService.get('RABBITMQ_HOST');
        const queueName = configService.get('RABBITMQ_QUEUE_NAME');

        return ClientProxyFactory.create({
          transport: Transport.RMQ,
          options: {
            urls: [`amqp://${user}:${password}@${host}`],
            queue: queueName,
            queueOptions: {
              durable: true,
            },
            noAck: false,
          },
        });
      },
      inject: [ConfigService],
    },
  ],
  controllers: [SubscribersController],
})
export class SubscribersModule {}
