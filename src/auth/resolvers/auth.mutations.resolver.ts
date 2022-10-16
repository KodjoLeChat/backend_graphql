import { UseGuards } from '@nestjs/common';
import { Args, Context, Mutation, Resolver } from '@nestjs/graphql';
import { AuthService } from '../auth.service';
import { AuthLoginOutPut } from '../dto/auth-login.dto';
import { LocalAuthGuard } from '../guards/local-auth.guards';

@Resolver()
export class AuthMutationResolver {
  constructor(private readonly authService: AuthService) {}

  @UseGuards(LocalAuthGuard)
  @Mutation(() => AuthLoginOutPut)
  async authLogin(
    @Context('req') req,
    @Args('username') _username: string,
    @Args('password') _password: string,
  ) {
    return this.authService.login(req.user);
  }
}
