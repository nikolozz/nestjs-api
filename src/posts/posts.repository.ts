import { Injectable } from '@nestjs/common';
import { UpdatePostDto } from './dto/updatePost.dto';
import { CreatePostDto } from './dto/createPost.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import Post from './entities/post.entity';
import { PostNotFoundException } from './exception/postNotFound.exception';
import User from 'src/users/entities/user.entity';

@Injectable()
export class PostsRepository {
  constructor(
    @InjectRepository(Post) private readonly postsRepository: Repository<Post>,
  ) {}

  getAllPosts() {
    return this.postsRepository.find();
  }

  async getPostById(id: number) {
    const post = await this.postsRepository.findOne(id);
    if (post) {
      return post;
    }
    throw new PostNotFoundException(id);
  }

  async replacePost(id: number, post: UpdatePostDto) {
    await this.postsRepository.update(id, post);
    const updatedPost = await this.postsRepository.findOne(id);
    if (updatedPost) {
      return updatedPost;
    }
    throw new PostNotFoundException(id);
  }

  async createPost(post: CreatePostDto, user: User) {
    const newPost = await this.postsRepository.create({
      ...post,
      author: user,
    });
    await this.postsRepository.save(newPost);
    return newPost;
  }

  async deletePost(id: number) {
    const deleteResponse = await this.postsRepository.delete(id);
    if (!deleteResponse.affected) {
      throw new PostNotFoundException(id);
    }
  }
}
