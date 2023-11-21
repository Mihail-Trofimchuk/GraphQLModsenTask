import { Parent, ResolveField, Resolver } from '@nestjs/graphql';
import { Cart } from './entities/cart.entity';
import { CartService } from './cart.service';
import { User } from './entities/user.entity';

@Resolver(() => User)
export class UsersResolver {
  constructor(private readonly cartService: CartService) {}

  //   @ResolveField('cart')
  //   cartt(@Parent() user: User): Promise<Cart> {
  //     const cart = this.cartService.findUserCart(user.user_id);
  //     return cart;
  //   }

  @ResolveField(() => Cart)
  cart(@Parent() user: User): Promise<Cart> {
    console.log(user);
    return this.cartService.findUserCart(user.user_id);
  }
}
