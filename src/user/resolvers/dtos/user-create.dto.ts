import { Field, InputType, ObjectType } from '@nestjs/graphql';
import { User } from 'src/user/models/user.model';

@ObjectType()
export class UserCreateOutput {
  @Field(() => User)
  user: User;
}

@InputType()
export class UserCreateInput {
  @Field(() => String)
  firstName: string;

  @Field(() => String)
  lastName: string;

  @Field(() => String)
  email: string;

  @Field(() => String)
  password: string;

  @Field(() => String, { nullable: true })
  avatar?: string;
}
