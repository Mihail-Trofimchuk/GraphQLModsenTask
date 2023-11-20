import { Directive, Field, Float, ID, Int, ObjectType } from '@nestjs/graphql';
import { Cart } from './cart.entity';
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Product } from 'apps/catalog/src/product/entities/product.entity';
import { Product as QraphQLProduct } from './product.entity';

@Entity({ name: 'cart_item_table' })
@ObjectType()
@Directive('@shareable')
@Directive('@key(fields: "cartItem_id")')
export class CartItem {
  @PrimaryGeneratedColumn()
  @Field(() => ID)
  cartItem_id: string;

  @ManyToOne(() => Product, (Product) => Product.cartItem)
  @Field(() => QraphQLProduct)
  cartProduct: Product;

  @Column()
  @Field(() => Int)
  cartItem_quantity: number;

  @Column()
  @Field(() => Float)
  subtotal: number;

  @Field(() => [Cart], { nullable: true })
  cart?: Cart[];
}
