import { CacheModule, Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import * as redisStore from 'cache-manager-redis-store';
import { PostsController } from './posts.controller';
import { PostsService } from './posts.service';
import { PostsSearchService } from './postsSearch.service';
import { PostsRepository } from './posts.repository';
import Post from './entities/post.entity';
import { SearchModule } from '../search/search.module';
import { PostsResolver } from './posts.resolver';
import { UsersModule } from '../users/users.module';
import { PostsDataLoader } from './loaders/posts.loader';

@Module({
  imports: [
    CacheModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        store: redisStore,
        host: configService.get('REDIS_HOST'),
        port: configService.get('REDIS_PORT'),
        ttl: 120,
      }),
    }),
    TypeOrmModule.forFeature([Post]),
    SearchModule,
    UsersModule,
  ],
  controllers: [PostsController],
  providers: [
    PostsService,
    PostsSearchService,
    PostsRepository,
    PostsResolver,
    PostsDataLoader,
  ],
})
export class PostsModule {}
