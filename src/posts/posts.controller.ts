import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import { PostsService } from './posts.service';
import { CreatePostDto } from './dto/createPost.dto';
import { UpdatePostDto } from './dto/updatePost.dto';
import { JwtAuthenticationGuard } from '../authentication/guards/jwtAuthentication.guard';
import RequestWithUser from '../authentication/interfaces/requestWIthUser.interface';
import { PaginationParams } from '../utils';

@Controller('posts')
export class PostsController {
  constructor(private readonly postsService: PostsService) {}

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

  @Get('search')
  async getPostsByKeywords(@Query('keyword') keywords: string) {
    return this.postsService.getPostsByKeywords(keywords);
  }

  @Get(':id')
  getPostById(@Param('id') id: string) {
    return this.postsService.getPostById(Number(id));
  }

  @Post()
  @UseGuards(JwtAuthenticationGuard)
  async createPost(
    @Body() post: CreatePostDto,
    @Req() request: RequestWithUser,
  ) {
    return this.postsService.createPost(post, request.user);
  }

  @Put(':id')
  @UseGuards(JwtAuthenticationGuard)
  async replacePost(@Param('id') id: number, @Body() post: UpdatePostDto) {
    return this.postsService.replacePost(Number(id), post);
  }

  @Delete(':id')
  @UseGuards(JwtAuthenticationGuard)
  async deletePost(@Param('id') id: string) {
    this.postsService.deletePost(Number(id));
  }
}
