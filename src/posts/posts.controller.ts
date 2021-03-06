import {
  Body,
  CacheKey,
  CacheTTL,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
  Req,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { PostsService } from './posts.service';
import { CreatePostDto } from './dto/createPost.dto';
import { UpdatePostDto } from './dto/updatePost.dto';
import RequestWithUser from '../authentication/interfaces/requestWIthUser.interface';
import { PaginationParams } from '../utils';
import { GET_POSTS_CACHE_KEY } from './constants';
import { HttpCacheInterceptor } from '../utils/interceptors/httpCache.interceptor';
import JwtTwoFactorGuard from '../authentication/guards/jwtTwoFactorAuthentication.guard';
import { EmailConfirmationGuard } from '../authentication/guards/emailConfirmation.guard';

@Controller('posts')
export class PostsController {
  constructor(private readonly postsService: PostsService) {}

  @UseInterceptors(HttpCacheInterceptor)
  @CacheKey(GET_POSTS_CACHE_KEY)
  @CacheTTL(120)
  @Get()
  async getPosts(
    @Query('search') search: string,
    @Query() pagination: PaginationParams,
  ) {
    if (search) {
      return this.postsService.searchForPosts(search, pagination);
    }
    return this.postsService.getAllPosts(pagination);
  }

  @UseInterceptors(HttpCacheInterceptor)
  @CacheKey(GET_POSTS_CACHE_KEY)
  @CacheTTL(120)
  @Get('search')
  async getPostsByKeywords(@Query('keyword') keywords: string) {
    return this.postsService.getPostsByKeywords(keywords);
  }

  @Get(':id')
  getPostById(@Param('id') id: string) {
    return this.postsService.getPostById(Number(id));
  }

  @Post()
  @UseGuards(EmailConfirmationGuard)
  @UseGuards(JwtTwoFactorGuard)
  async createPost(
    @Body() post: CreatePostDto,
    @Req() request: RequestWithUser,
  ) {
    return this.postsService.createPost(post, request.user);
  }

  @Put(':id')
  @UseGuards(EmailConfirmationGuard)
  @UseGuards(JwtTwoFactorGuard)
  async replacePost(@Param('id') id: number, @Body() post: UpdatePostDto) {
    return this.postsService.replacePost(Number(id), post);
  }

  @Delete(':id')
  @UseGuards(EmailConfirmationGuard)
  @UseGuards(JwtTwoFactorGuard)
  async deletePost(@Param('id') id: string) {
    this.postsService.deletePost(Number(id));
  }
}
