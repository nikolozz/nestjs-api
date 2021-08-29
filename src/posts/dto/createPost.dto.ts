import { IsNotEmpty, IsOptional, IsString } from 'class-validator';
import Category from '../../categories/entities/category.entity';

export class CreatePostDto {
  @IsString()
  @IsNotEmpty()
  title: string;

  @IsString()
  @IsNotEmpty()
  content: string;

  // @IsOptional()
  // categories: Category[];
}
