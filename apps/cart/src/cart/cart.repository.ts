import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Cart } from './entities/cart.entity';
import { User } from 'apps/account/src/user/entities/user.entity';
import { Product } from 'apps/catalog/src/product/entities/product.entity';
import { CartItem } from './entities/cart-item';

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
    // const queryBuilder = await this.cartRepository
    //   .createQueryBuilder('cart')
    //   .leftJoinAndSelect('cart.items', 'item')
    //   .leftJoinAndSelect('item.cartProduct', 'product')
    //   .leftJoinAndSelect('product.category', 'category')
    //   .where('cart.id = :cartId', { cartId: id });

    // console.log(queryBuilder.getSql());
    const cart = await this.cartRepository.findOne({
      where: { id: id },
      relations: ['items', 'items.cartProduct', 'items.cartProduct.category'],
    });

    // console.log(await queryBuilder.getOne());
    return cart;
    //return queryBuilder.getOne();
  }

  async findCartWithItems(id: number) {
    return await this.cartRepository.findOne({
      where: { id: id },
      relations: ['items'],
    });
  }

  async findUserCart(id: number): Promise<Cart> {
    return await this.cartRepository.findOne({
      where: { user: { user_id: id } },
    });
  }

  async createItem(product: Product, cart, items_quantity: number) {
    const newCartItem = new CartItem();
    newCartItem.cartProduct = product;
    newCartItem.cartItem_quantity = items_quantity;
    newCartItem.subtotal = product.price * items_quantity;
    // newCartItem.cartProduct.available_quantity = newCartItem.cartItem_quantity =
    //   createCartItemInput.quantity;
    // newCartItem.subtotal =
    //   newCartItem.cartProduct.price * createCartItemInput.quantity;

    // Добавьте новый элемент корзины в существующую корзину
    if (!cart.items) {
      cart.items = [];
    }
    cart.items.push(newCartItem);
    await this.cartRepository.save(cart);
    return newCartItem;
  }

  async getCartItems() {}
}
