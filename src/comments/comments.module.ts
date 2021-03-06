import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { CommentsController } from './comments.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import Comment from './entities/comment.entity';
import { CreateCommentHandler } from './commands/handlers/createComment.handler';
import { GetCommentsHandler } from './queries/handlers/getComments.handler';
import { GetCommentRepliesHandler } from './queries/handlers/getCommentReplies.handler';

@Module({
  imports: [TypeOrmModule.forFeature([Comment]), CqrsModule],
  controllers: [CommentsController],
  providers: [
    CreateCommentHandler,
    GetCommentsHandler,
    GetCommentRepliesHandler,
  ],
})
export class CommentsModule {}
