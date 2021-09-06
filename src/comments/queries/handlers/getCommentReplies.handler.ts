import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { InjectRepository } from '@nestjs/typeorm';
import { TreeRepository } from 'typeorm';
import Comment from '../../entities/comment.entity';
import { GetCommentRepliesQuery } from '../implementations/getCommentReplies.query';

@QueryHandler(GetCommentRepliesQuery)
export class GetCommentRepliesHandler
  implements IQueryHandler<GetCommentRepliesQuery> {
  constructor(
    @InjectRepository(Comment)
    private readonly commentRepository: TreeRepository<Comment>,
  ) {}

  async execute({ parentId }: GetCommentRepliesQuery) {
    const parentComment = await this.commentRepository.findOne(parentId);
    return this.commentRepository
      .createDescendantsQueryBuilder('comment', 'commentClosure', parentComment)
      .getMany();
  }
}
