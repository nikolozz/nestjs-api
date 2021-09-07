import { Type } from 'class-transformer';
import {
  IsNotEmpty,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';
import { ObjectWithId } from '../../utils/types/objectWithId.dto';

export class CreateCommentDto {
  @IsNotEmpty()
  @IsString()
  content: string;

  @ValidateNested()
  @Type(() => ObjectWithId)
  post: ObjectWithId;

  @IsOptional()
  @Type(() => Number)
  parentId?: number;
}
