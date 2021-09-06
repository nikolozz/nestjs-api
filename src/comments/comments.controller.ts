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
import { JwtAuthenticationGuard } from '../authentication/guards/jwtAuthentication.guard';
import { GetCommentsDto } from './dto/getComments.dto';
import { GetCommentsQuery } from './queries/implementations/getComments.query';

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

  @Post()
  @UseGuards(JwtAuthenticationGuard)
  createComment(
    @Body() createComment: CreateCommentDto,
    @Req() request: RequestWithUser,
  ) {
    return this.commandBus.execute(
      new CreateCommentCommand(createComment, request.user),
    );
  }
}
