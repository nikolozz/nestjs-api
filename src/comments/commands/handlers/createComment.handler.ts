import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateCommentCommand } from '../implementations/createComment.command';
import Comment from '../../entities/comment.entity';
import { Repository } from 'typeorm';

@CommandHandler(CreateCommentCommand)
export class CreateCommentHandler
  implements ICommandHandler<CreateCommentCommand> {
  constructor(
    @InjectRepository(Comment)
    private readonly commentRepository: Repository<Comment>,
  ) {}

  async execute(command: CreateCommentCommand) {
    if (command.comment.parentId) {
      const replyComment = await this.addReply(command);
      return replyComment;
    }

    const newPostWithComment = await this.commentRepository.create({
      ...command.comment,
      author: command.author,
    });

    await this.commentRepository.save(newPostWithComment);
    return newPostWithComment;
  }

  private async addReply(command: CreateCommentCommand) {
    const parentComment = await this.commentRepository.findOne(
      command.comment.parentId,
    );
    const reply = await this.commentRepository.create({
      ...command.comment,
      author: command.author,
      parent: parentComment,
    });
    return this.commentRepository.save(reply);
  }
}
