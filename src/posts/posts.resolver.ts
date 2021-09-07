import {
  Args,
  Context,
  Mutation,
  Parent,
  Query,
  ResolveField,
  Resolver,
} from '@nestjs/graphql';
import { Post } from './models/post.model';
import { PostsService } from './posts.service';
import { PaginationInput } from '../utils/types/paginationInput';
import { UseGuards } from '@nestjs/common';
import { CreatePostInput } from './input/post.input';
import { GraphqlJwtAuthGuard } from '../authentication/guards/graphqlJwtAuthentication.guard';
import RequestWithUser from '../authentication/interfaces/requestWIthUser.interface';
import { PostsDataLoader } from './loaders/posts.loader';

@Resolver(() => Post)
export class PostsResolver {
  constructor(
    private readonly postsService: PostsService,
    private readonly postsLoader: PostsDataLoader,
  ) {}

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

  @ResolveField()
  async author(@Parent() post: Post) {
    const { authorId } = post;
    return this.postsLoader.batchAuthors.load(authorId);
  }
}
