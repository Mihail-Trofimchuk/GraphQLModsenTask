import { Injectable } from '@nestjs/common';
import { CartRepository } from './cart.repository';
import { User } from 'apps/account/src/user/entities/user.entity';
import { Cart } from './entities/cart.entity';

@Injectable()
export class CartService {
  constructor(private readonly cartRepository: CartRepository) {}

  createCart(user: User): Promise<Cart> {
    console.log(user);
    return this.cartRepository.createCart(user);
  }

  findCartById(id: number) {
    return this.cartRepository.findCartById(id);
  }

  findUserCart(id: number): Promise<Cart> {
    return this.cartRepository.findUserCart(id);
  }
}
