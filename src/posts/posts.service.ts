import { Injectable } from '@nestjs/common';
import { CreatePostDto } from './dto/createPost.dto';
import { UpdatePostDto } from './dto/updatePost.dto';
import { PostsRepository } from './posts.repository';
import User from '../users/entities/user.entity';

@Injectable()
export class PostsService {
  constructor(private readonly postsRepository: PostsRepository) {}

  getAllPosts() {
    return this.postsRepository.getAllPosts();
  }

  getPostById(id: number) {
    return this.postsRepository.getPostById(id);
  }

  replacePost(id: number, post: UpdatePostDto) {
    return this.postsRepository.replacePost(id, post);
  }

  createPost(post: CreatePostDto, user: User) {
    return this.postsRepository.createPost(post, user);
  }

  deletePost(id: number) {
    return this.postsRepository.deletePost(id);
  }
}
