import { Type } from 'class-transformer';
import { IsNotEmpty } from 'class-validator';

export class GetCommentRepliesDto {
  @IsNotEmpty()
  @Type(() => Number)
  parentId: number;
}
