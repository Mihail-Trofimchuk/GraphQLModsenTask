import { JwtAuthGuard } from '@app/auth';
import { Inject, UseGuards } from '@nestjs/common';
import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { CreateUserInput } from './dto/input/create-user.input';
import { LoginUserInput } from './dto/input/login-user.input';
import { User } from './entities/user.entity';
import { UserService } from './user.service';
import { UserAndToken } from './response/login.response';
import { ClientKafka } from '@nestjs/microservices';

@Resolver(() => User)
export class UserResolver {
  constructor(
    private readonly userService: UserService,
    @Inject('USER_CLIENT') private kafkaClient: ClientKafka,
  ) {}

  async onModuleInit() {
    this.kafkaClient.subscribeToResponseOf(MESSAGE_PATTERN.GET_CONTAINERS);
    this.kafkaClient.subscribeToResponseOf(MESSAGE_PATTERN.GET_TRUCK);

    await this.kafkaClient.connect();
  }

  @Mutation(() => User)
  async register(
    @Args('createUserInput') createUserInput: CreateUserInput,
  ): Promise<User> {
    return this.userService.register(createUserInput);
  }

  @Mutation(() => UserAndToken)
  async login(
    @Args('loginUserInput') loginUserInput: LoginUserInput,
    //@Context('res') res: Response,
  ): Promise<UserAndToken> {
    return this.userService.login(loginUserInput);
  }

  // @Query(() => User, { name: 'getUser' })
  // getUser(@Args({ name: 'id' }) id: string): User {
  //   return this.userService.findOne(id);
  // }

  @Query(() => [User], { name: 'user' })
  @UseGuards(JwtAuthGuard)
  findAll(): Promise<User[]> {
    return this.userService.findAll();
  }

  // @ResolveReference()
  // resolveReference(reference: { __typename: string; id: string }): User {
  //   return this.userService.findOne(reference.id);
  // }

  // @Query(() => User, { name: 'user' })
  // findOne(@Args('user_ids') id: string) {
  //   return this.userService.findOne(id);
  // }

  // @Mutation(() => User)
  // updateUser(@Args('updateUserInput') updateUserInput: UpdateUserInput) {
  //   return this.userService.update(updateUserInput.id, updateUserInput);
  // }

  // @Mutation(() => User)
  // removeUser(@Args('user_id') id: string) {
  //   return this.userService.remove(id);
  // }
}
