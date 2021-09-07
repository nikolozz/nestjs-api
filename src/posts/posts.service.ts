import { CACHE_MANAGER, Inject, Injectable } from '@nestjs/common';
import { Cache } from 'cache-manager';
import { CreatePostDto } from './dto/createPost.dto';
import { UpdatePostDto } from './dto/updatePost.dto';
import { PostsRepository } from './posts.repository';
import { PostsSearchService } from './postsSearch.service';
import { PaginationParams } from '../utils/types/paginationParams';
import { PaginationResult } from '../utils/types/paginationResult.interface';
import User from '../users/entities/user.entity';
import Post from './entities/post.entity';
import { GET_POSTS_CACHE_KEY } from './constants';

@Injectable()
export class PostsService {
  @Inject(CACHE_MANAGER)
  private readonly cacheManager: Cache;

  constructor(
    private readonly searchService: PostsSearchService,
    private readonly postsRepository: PostsRepository,
  ) {}

  async clearCache() {
    const keys = await this.cacheManager.store.keys();
    keys.forEach((key: string) => {
      if (key.startsWith(GET_POSTS_CACHE_KEY)) {
        this.cacheManager.del(key);
      }
    });
  }

  getAllPosts(pagination: PaginationParams): Promise<PaginationResult<Post[]>> {
    return this.postsRepository.getAllPosts(pagination);
  }

  getPostById(id: number) {
    return this.postsRepository.getPostById(id);
  }

  async replacePost(id: number, post: UpdatePostDto) {
    const updatedPost = await this.postsRepository.replacePost(id, post);
    await this.searchService.update(id, post);
    await this.clearCache();
    return updatedPost;
  }

  async createPost(post: CreatePostDto, user: User) {
    const newPost = await this.postsRepository.createPost(post, user);
    await this.searchService.indexPost(newPost);
    await this.clearCache();
    return newPost;
  }

  async searchForPosts(text: string, pagination: PaginationParams) {
    const { results } = await this.searchService.search(text, pagination);
    const ids = results.map(({ id }) => Number(id));
    if (!ids.length) {
      return [];
    }
    const posts = await this.postsRepository.getPostsByIds(ids);
    return posts;
  }

  async getPostsByKeywords(keywords: string) {
    return this.postsRepository.getPostsByKeywords(keywords);
  }

  async deletePost(id: number) {
    await Promise.all([
      this.postsRepository.deletePost(id),
      this.searchService.deletePost(id),
      await this.clearCache(),
    ]);
  }
}
