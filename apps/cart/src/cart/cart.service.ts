import { Inject, Injectable } from '@nestjs/common';
import { CartRepository } from './cart.repository';
import { User } from 'apps/account/src/user/entities/user.entity';
import { Cart } from './entities/cart.entity';
import { CreateCartItemInput } from './dto/input/create-cart-item.input';
import { Product } from 'apps/catalog/src/product/entities/product.entity';
import { lastValueFrom } from 'rxjs';
import { ClientKafka } from '@nestjs/microservices';

@Injectable()
export class CartService {
  constructor(
    private readonly cartRepository: CartRepository,
    @Inject('CART_CLIENT') private kafkaClient: ClientKafka,
  ) {}

  async onModuleInit() {
    this.kafkaClient.subscribeToResponseOf('get_product');
    //this.kafkaClient.subscribeToResponseOf('search_cart');
    await this.kafkaClient.connect();
  }

  // getCartItems(id: number) {
  //   return this.cartRepository.getCartItems(id);
  // }

  createCart(user: User): Promise<Cart> {
    console.log(user);
    return this.cartRepository.createCart(user);
  }

  async create(createCartItemInput: CreateCartItemInput) {
    const cart = await this.cartRepository.findCartById(
      createCartItemInput.cart_id,
    );
    console.log(cart);

    const product: Product = await lastValueFrom(
      this.kafkaClient.send('get_product', {
        id: createCartItemInput.product_id,
      }),
    );
    console.log(product);
    return this.cartRepository.createItem(
      product,
      cart,
      createCartItemInput.quantity,
    );
  }

  findCartById(id: number) {
    return this.cartRepository.findCartById(id);
  }

  findUserCart(id: number): Promise<Cart> {
    return this.cartRepository.findUserCart(id);
  }
}
