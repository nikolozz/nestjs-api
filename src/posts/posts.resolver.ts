import {
  Args,
  Context,
  Mutation,
  Parent,
  Query,
  ResolveField,
  Resolver,
  Subscription,
} from '@nestjs/graphql';
import { Post } from './models/post.model';
import { PostsService } from './posts.service';
import { PaginationInput } from '../utils/types/paginationInput';
import { Inject, UseGuards } from '@nestjs/common';
import { CreatePostInput } from './input/post.input';
import { GraphqlJwtAuthGuard } from '../authentication/guards/graphqlJwtAuthentication.guard';
import RequestWithUser from '../authentication/interfaces/requestWIthUser.interface';
import { PostsDataLoader } from './loaders/posts.loader';
import { PUB_SUB_TOKEN } from '../pub-sub/contants';
import { RedisPubSub } from 'graphql-redis-subscriptions';
import { POST_ADDED_EVENT } from './constants';

@Resolver(() => Post)
export class PostsResolver {
  @Inject(PUB_SUB_TOKEN)
  private readonly pubSub: RedisPubSub;

  constructor(
    private readonly postsService: PostsService,
    private readonly postsLoader: PostsDataLoader,
  ) {}

  @Subscription(() => Post)
  postAdded() {
    return this.pubSub.asyncIterator(POST_ADDED_EVENT);
  }

  @Query(() => [Post])
  async posts(@Args('input') pagination: PaginationInput) {
    const posts = await this.postsService.getAllPosts(pagination);
    return posts.items;
  }

  @Mutation(() => Post)
  @UseGuards(GraphqlJwtAuthGuard)
  async createPost(
    @Args('input') createPostInput: CreatePostInput,
    @Context() context: { req: RequestWithUser },
  ) {
    const newPost = await this.postsService.createPost(
      createPostInput,
      context.req.user,
    );
    await this.pubSub.publish(POST_ADDED_EVENT, { postAdded: newPost });
    return newPost;
  }

  @ResolveField()
  async author(@Parent() post: Post) {
    const { authorId } = post;
    return this.postsLoader.batchAuthors.load(authorId);
  }
}
