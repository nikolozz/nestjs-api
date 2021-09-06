import { Type } from 'class-transformer';
import {
  IsNotEmpty,
  IsNumber,
  IsString,
  ValidateNested,
} from 'class-validator';
import { ObjectWithId } from 'src/utils/types/objectWithId.dto';

export class CreateCommentDto {
  @IsNotEmpty()
  @IsString()
  content: string;

  @ValidateNested()
  @Type(() => ObjectWithId)
  post: ObjectWithId;
}
