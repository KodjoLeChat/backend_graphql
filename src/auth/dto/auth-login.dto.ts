import { Field, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class AuthLoginOutPut {
  @Field(() => String)
  accessToken: string;
}
