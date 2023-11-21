import { Args, Parent, Query, ResolveField, Resolver } from '@nestjs/graphql';
import { CartService } from './cart.service';
import { Cart } from './entities/cart.entity';
import { User } from './entities/user.entity';

@Resolver(() => Cart)
export class CartResolver {
  constructor(private readonly cartService: CartService) {
    console.log('CartResolver constructor called');
  }

  @Query(() => Cart, { name: 'cart' })
  findOne(@Args('id') id: number) {
    return this.cartService.findCartById(id);
  }

  // @ResolveReference()
  // resolveReference(reference: { __typename: string; id: number }) {
  //   const cart = this.cartService.findCartById(reference.id);
  //   console.log(cart);
  //   return cart;
  // }

  @ResolveField(() => User)
  user(@Parent() cart: Cart): any {
    console.log(cart.user.user_id);
    return { __typename: 'User', user_id: cart.user.user_id };
  }

  // @ResolveField('user')
  // async user(@Parent() cart: Cart) {
  //   const { id } = cart;
  //   return this.cartService.findUserCart(id);
  // }
}

// @Mutation(() => Cart)
// createCart(@Args('createCartInput') createCartInput: CreateCartInput) {
//   return this.cartService.create(createCartInput);
// }

// @Query(() => [Cart], { name: 'cart' })
// findAll() {
//   return this.cartService.findAll();
// }

// @Mutation(() => Cart)
// updateCart(@Args('updateCartInput') updateCartInput: UpdateCartInput) {
//   return this.cartService.update(updateCartInput.id, updateCartInput);
// }

// @Mutation(() => Cart)
// removeCart(@Args('id', { type: () => Int }) id: number) {
//   return this.cartService.remove(id);
// }

// @ResolveField(() => User)
// user(@Parent() cart: Cart): any {
//   return { __typename: 'User', id: cart.user.user_id };
// }

// @ResolveReference()
// resolveReference(reference: {
//   __typename: string;
//   id: number;
// }): Promise<Cart> {
//   return this.cartService.findCartById(reference.id);
// }
