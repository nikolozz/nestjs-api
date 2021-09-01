import { Injectable } from '@nestjs/common';
import { CreatePostDto } from './dto/createPost.dto';
import { UpdatePostDto } from './dto/updatePost.dto';
import { PostsRepository } from './posts.repository';
import User from '../users/entities/user.entity';
import { PostsSearchService } from './postsSearch.service';

@Injectable()
export class PostsService {
  constructor(
    private readonly searchService: PostsSearchService,
    private readonly postsRepository: PostsRepository,
  ) {}

  getAllPosts() {
    return this.postsRepository.getAllPosts();
  }

  getPostById(id: number) {
    return this.postsRepository.getPostById(id);
  }

  async replacePost(id: number, post: UpdatePostDto) {
    const updatedPost = await this.postsRepository.replacePost(id, post);
    await this.searchService.update(id, post);
    return updatedPost;
  }

  async createPost(post: CreatePostDto, user: User) {
    const newPost = await this.postsRepository.createPost(post, user);
    await this.searchService.indexPost(newPost);
    return newPost;
  }

  async searchForPosts(text: string) {
    const searchResult = await this.searchService.search(text);
    const ids = searchResult.map(({ id }) => Number(id));
    if (!ids.length) {
      return [];
    }
    const posts = await this.postsRepository.getAllPosts(ids);
    return posts;
  }

  async deletePost(id: number) {
    await Promise.all([
      this.postsRepository.deletePost(id),
      this.searchService.deletePost(id),
    ]);
  }
}
