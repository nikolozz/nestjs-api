import { Field, Int, ObjectType } from '@nestjs/graphql';
import User from '../../users/entities/user.entity';
import { UserModel } from './user.model';

@ObjectType()
export class Post {
  @Field(() => Int)
  id: number;

  @Field()
  title: string;

  @Field(() => [String], { nullable: true })
  keywords: string[];

  @Field(() => Int)
  authorId: number;

  @Field(() => UserModel)
  author: User;
}
