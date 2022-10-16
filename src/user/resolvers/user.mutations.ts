import { HttpException, HttpStatus } from '@nestjs/common';
import { Args, Mutation, Resolver } from '@nestjs/graphql';
import { User } from '../models/user.model';
import { UserService } from '../user.service';
import { UserCreateInput, UserCreateOutput } from './dtos/user-create.dto';

@Resolver(User)
export class UserMutationsResolver {
  constructor(private readonly userService: UserService) {}
  @Mutation(() => UserCreateOutput)
  async createUser(
    @Args('user') user: UserCreateInput,
  ): Promise<UserCreateOutput> {
    const res = await this.userService.createUser(user);
    if (res) return res;
    throw new HttpException('User not created', HttpStatus.NOT_MODIFIED);
  }
}
