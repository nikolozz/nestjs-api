import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { GetCommentsQuery } from '../implementations/getComments.query';
import Comment from '../../entities/comment.entity';

@QueryHandler(GetCommentsQuery)
export class GetCommentsHandler implements IQueryHandler<GetCommentsQuery> {
  constructor(
    @InjectRepository(Comment)
    private readonly commentRepository: Repository<Comment>,
  ) {}

  execute({ postId }: GetCommentsQuery) {
    return this.commentRepository.find({ post: { id: postId } });
  }
}
