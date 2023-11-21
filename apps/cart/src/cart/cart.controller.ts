import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { CartService } from './cart.service';
import { User } from 'apps/account/src/user/entities/user.entity';
import { Cart } from './entities/cart.entity';

@Controller()
export class CartController {
  constructor(private readonly cartService: CartService) {}

  @MessagePattern('create_cart')
  async createCart(@Payload() { user }: { user: User }): Promise<Cart> {
    console.log(user);
    console.log(user.email);

    return await this.cartService.createCart(user);
  }
}
