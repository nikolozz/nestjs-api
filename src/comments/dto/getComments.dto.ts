import { Type } from 'class-transformer';
import { IsNotEmpty } from 'class-validator';

export class GetCommentsDto {
  @IsNotEmpty()
  @Type(() => Number)
  postId: number;
}
