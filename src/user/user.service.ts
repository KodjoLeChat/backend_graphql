import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './models/user.model';
import {
  UserCreateInput,
  UserCreateOutput,
} from './resolvers/dtos/user-create.dto';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async getUser(email: User['email']): Promise<User | null> {
    const user = await this.userRepository.findOne({ where: { email: email } });
    if (user) return user;
    return null;
  }

  async createUser(
    userInput: UserCreateInput,
  ): Promise<UserCreateOutput | null> {
    let newUser = this.userRepository.create(userInput);
    if (!newUser) return null;
    newUser = await this.userRepository.save(newUser);
    if (!newUser) return null;
    return { user: newUser };
  }
}
