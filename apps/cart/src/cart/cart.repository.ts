import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Cart } from './entities/cart.entity';
import { User } from 'apps/account/src/user/entities/user.entity';

@Injectable()
export class CartRepository {
  constructor(
    @InjectRepository(Cart)
    private cartRepository: Repository<Cart>,
  ) {}

  async createCart(user: User): Promise<Cart> {
    const newCart = this.cartRepository.create();
    newCart.user = user;
    const savedCart = await this.cartRepository.save(newCart);

    return savedCart;
  }

  async findCartById(id: number) {
    return await this.cartRepository.findOne({
      where: { id: id },
    });
  }

  async findUserCart(id: number): Promise<Cart> {
    return await this.cartRepository.findOne({
      where: { user: { user_id: id } },
    });
  }
}
