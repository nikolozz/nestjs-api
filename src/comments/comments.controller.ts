import {
  Body,
  Controller,
  Get,
  Post,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { CreateCommentDto } from './dto/createComment.dto';
import { CreateCommentCommand } from './commands/implementations/createComment.command';
import RequestWithUser from '../authentication/interfaces/requestWIthUser.interface';
import { GetCommentsDto } from './dto/getComments.dto';
import { GetCommentsQuery } from './queries/implementations/getComments.query';
import { GetCommentRepliesDto } from './dto/getCommentReplies.dto';
import { GetCommentRepliesQuery } from './queries/implementations/getCommentReplies.query';
import { EmailConfirmationGuard } from '../authentication/guards/emailConfirmation.guard';
import JwtTwoFactorGuard from '../authentication/guards/jwtTwoFactorAuthentication.guard';

@Controller('comments')
export class CommentsController {
  constructor(
    private readonly commandBus: CommandBus,
    private readonly queryBus: QueryBus,
  ) {}

  @Get()
  async getComments(@Query() { postId }: GetCommentsDto) {
    return this.queryBus.execute(new GetCommentsQuery(postId));
  }

  @Get('replies')
  async getCommentReplies(@Query() { parentId }: GetCommentRepliesDto) {
    return this.queryBus.execute(new GetCommentRepliesQuery(parentId));
  }

  @Post()
  @UseGuards(EmailConfirmationGuard)
  @UseGuards(JwtTwoFactorGuard)
  createComment(
    @Body() createComment: CreateCommentDto,
    @Req() request: RequestWithUser,
  ) {
    return this.commandBus.execute(
      new CreateCommentCommand(createComment, request.user),
    );
  }
}
