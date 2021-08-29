import { IsNotEmpty, IsNumber } from 'class-validator';
import { CreatePostDto } from './createPost.dto';

export class UpdatePostDto extends CreatePostDto {
  @IsNotEmpty()
  @IsNumber()
  id: number;
}
