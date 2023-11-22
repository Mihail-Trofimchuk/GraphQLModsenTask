import { Args, Mutation, Resolver } from '@nestjs/graphql';
import { CartService } from './cart.service';
import { CartItem } from './entities/cart-item';
import { CreateCartItemInput } from './dto/input/create-cart-item.input';

@Resolver(() => CartItem)
export class CartItemResolver {
  constructor(private readonly cartService: CartService) {}

  @Mutation(() => CartItem)
  createCartItem(
    @Args('createCartItemInput') createCartItemInput: CreateCartItemInput,
  ) {
    return this.cartService.create(createCartItemInput);
  }
}
