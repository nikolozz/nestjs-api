import { Args, Context, Mutation, Query, Resolver } from '@nestjs/graphql';
import { Post } from './models/post.model';
import { PostsService } from './posts.service';
import { PaginationInput } from '../utils/types/paginationInput';
import { UseGuards } from '@nestjs/common';
import { CreatePostInput } from './input/post.input';
import { GraphqlJwtAuthGuard } from '../authentication/guards/graphqlJwtAuthentication.guard';
import RequestWithUser from '../authentication/interfaces/requestWIthUser.interface';

@Resolver(() => Post)
export class PostsResolver {
  constructor(private postsService: PostsService) {}

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
    return this.postsService.createPost(createPostInput, context.req.user);
  }
}
