import { CreateCommentDto } from '../../dto/createComment.dto';
import User from '../../../users/entities/user.entity';

export class CreateCommentCommand {
  constructor(
    public readonly comment: CreateCommentDto,
    public readonly author: User,
  ) {}
}
