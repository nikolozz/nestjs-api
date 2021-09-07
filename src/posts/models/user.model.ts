import { ObjectType, Field } from '@nestjs/graphql';

@ObjectType()
export class UserModel {
  @Field()
  public id?: number;

  @Field(() => String)
  public email: string;

  @Field(() => String)
  public name: string;
}
