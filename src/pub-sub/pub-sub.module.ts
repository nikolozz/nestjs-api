import { Module, Global } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { RedisPubSub } from 'graphql-redis-subscriptions';
import { PUB_SUB_TOKEN } from './contants';

@Global()
@Module({
  imports: [ConfigModule],
  providers: [
    {
      provide: PUB_SUB_TOKEN,
      inject: [ConfigService],
      useFactory: (configService: ConfigService) =>
        new RedisPubSub({
          connection: {
            host: configService.get('REDIS_HOST'),
            port: configService.get('REDIS_PORT'),
          },
        }),
    },
  ],
  exports: [PUB_SUB_TOKEN],
})
export class PubSubModule {}
