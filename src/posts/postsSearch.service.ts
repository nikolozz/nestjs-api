import { Injectable } from '@nestjs/common';
import { ElasticsearchService } from '@nestjs/elasticsearch';
import Post from './entities/post.entity';
import { PostsSearchResult } from './interfaces/postSearchResult.interface';
import { PostSearchBody } from './interfaces/postSearchBody.interface';

@Injectable()
export class PostsSearchService {
  private readonly index = 'posts';
  constructor(private readonly elasticSearchService: ElasticsearchService) {}

  indexPost(post: Post) {
    return this.elasticSearchService.index<PostsSearchResult, PostSearchBody>({
      index: this.index,
      body: {
        id: post.id,
        title: post.title,
        content: post.content,
        authorId: post.author.id,
      },
    });
  }

  deletePost(id: number) {
    return this.elasticSearchService.deleteByQuery({
      index: this.index,
      body: {
        id,
      },
    });
  }

  async search(text: string) {
    const { body } = await this.elasticSearchService.search<PostsSearchResult>({
      index: this.index,
      body: {
        query: {
          multi_match: {
            query: text,
            fields: ['title', 'content'],
          },
        },
      },
    });
    const hits = body.hits.hits;
    return hits.map(post => post._source);
  }

  update(id: number, post: Post) {
    const script = Object.entries(post).reduce((result, [key, value]) => {
      return `${result} ctx._source.${key}='${value}';`;
    }, '');
    return this.elasticSearchService.updateByQuery({
      index: this.index,
      body: {
        query: {
          match: {
            id,
          },
        },
        script: {
          inline: script,
        },
      },
    });
  }
}
