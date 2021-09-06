import { Injectable } from '@nestjs/common';
import { UpdatePostDto } from './dto/updatePost.dto';
import { CreatePostDto } from './dto/createPost.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository, MoreThan } from 'typeorm';
import Post from './entities/post.entity';
import { PostNotFoundException } from './exception/postNotFound.exception';
import User from '../users/entities/user.entity';
import { PaginationParams } from '../utils';

@Injectable()
export class PostsRepository {
  constructor(
    @InjectRepository(Post) private readonly postsRepository: Repository<Post>,
  ) {}

  async getAllPosts(pagination: PaginationParams) {
    const { startId, offset, limit } = pagination;

    const { query, count: postsCount } = await this.buildKeysetPaginationQuery(
      startId,
    );

    const [items, count] = await this.postsRepository.findAndCount({
      where: query,
      order: {
        id: 'ASC',
      },
      skip: offset,
      take: limit,
    });
    return { items, count: startId ? postsCount : count };
  }

  getPostsByIds(ids: number[]) {
    return this.postsRepository.find({
      where: { id: In(ids) },
    });
  }

  async getPostById(id: number) {
    const post = await this.postsRepository.findOne(id);
    if (post) {
      return post;
    }
    throw new PostNotFoundException(id);
  }

  getPostsByKeywords(keyword: string) {
    return this.postsRepository.query(
      `SELECT * from post WHERE $1 = ANY(keywords)`,
      [keyword],
    );
  }

  async replacePost(id: number, post: UpdatePostDto) {
    await this.postsRepository.update(id, post);
    const updatedPost = await this.postsRepository.findOne(id);
    if (!updatedPost) {
      throw new PostNotFoundException(id);
    }
    return updatedPost;
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

  private async buildKeysetPaginationQuery(startId: number | undefined) {
    if (!startId) {
      return {};
    }
    const query = { id: MoreThan(startId) };
    const count = await this.postsRepository.count();
    return { query, count };
  }
}
