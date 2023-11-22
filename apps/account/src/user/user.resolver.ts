import { JwtAuthGuard } from '@app/auth';
import { UseGuards } from '@nestjs/common';
import {
  Args,
  Mutation,
  Parent,
  Query,
  ResolveField,
  Resolver,
} from '@nestjs/graphql';
import { CreateUserInput } from './dto/input/create-user.input';
import { LoginUserInput } from './dto/input/login-user.input';
import { User } from './entities/user.entity';
import { UserAndToken } from './response/login.response';
import { UserService } from './user.service';

@Resolver(() => User)
export class UserResolver {
  constructor(
    private readonly userService: UserService, // @Inject('USER_CLIENT') private kafkaClient: ClientKafka,
  ) {}

  // async onModuleInit() {
  //   this.kafkaClient.subscribeToResponseOf('create_cart');
  //   // this.kafkaClient.subscribeToResponseOf(MESSAGE_PATTERN.GET_TRUCK);

  //   await this.kafkaClient.connect();
  // }

  @Mutation(() => User)
  async register(
    @Args('createUserInput') createUserInput: CreateUserInput,
  ): Promise<User> {
    const user = await this.userService.register(createUserInput);
    await this.userService.createCart(user);
    return user;
  }

  @Mutation(() => UserAndToken)
  async login(
    @Args('loginUserInput') loginUserInput: LoginUserInput,
  ): Promise<UserAndToken> {
    return this.userService.login(loginUserInput);
  }

  @Query(() => User, { name: 'getUser' })
  getUser(@Args({ name: 'id' }) id: number): Promise<User> {
    return this.userService.findUserById(id);
  }

  @Query(() => [User], { name: 'user' })
  @UseGuards(JwtAuthGuard)
  findAll(): Promise<User[]> {
    return this.userService.findAll();
  }

  @ResolveField('cart')
  async cart(@Parent() user: User) {
    const { user_id } = user;
    console.log(user_id);
    return this.userService.getCartByUserId(user_id);
  }

  // @ResolveReference()
  // resolveReference(reference: {
  //   __typename: string;
  //   id: number;
  // }): Promise<User> {
  //   console.log(reference.id);
  //   const user = this.userService.findUserById(reference.id);
  //   console.log(user);
  //   return user;
  // }

  // @ResolveReference()
  // resolveReference(reference: { __typename: string; id: number }) {
  //   return this.userService.findUserById(reference.id);
  // }

  // @ResolveField('user')
  // async user(@Parent() cart) {
  //   const { id } = cart;
  //   return this.userService.findUserByCartId(id);
  // }

  // @ResolveField(() => Cart)
  // cart(@Parent() user: User): any {
  //   return { __typename: 'Cart', id: user.user_id };
  // }

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
