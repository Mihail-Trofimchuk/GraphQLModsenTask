import { ObjectType, Field, Float, ID, Int, Directive } from '@nestjs/graphql';
import { CartItem } from './cart-item';
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  JoinTable,
  ManyToMany,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { User } from 'apps/account/src/user/entities/user.entity';

@Entity({ name: 'cart_table' })
@Directive('@shareable')
@ObjectType()
export class Cart {
  @PrimaryGeneratedColumn()
  @Field(() => ID)
  id: number;

  @Column()
  @Field(() => Float)
  total_quantity: number;

  @Column()
  @Field(() => Int)
  total_price: number;

  @Column()
  @Field()
  @CreateDateColumn()
  created_at: string;

  @Column()
  @Field()
  updated_at: string;

  //@OneToOne(() => User, (user) => user.cart) // Определение связи
  // @JoinColumn({ name: 'id' })

  @OneToOne(() => User)
  @JoinColumn()
  @Field(() => User)
  user: User;

  @ManyToMany(() => CartItem, { cascade: true }) // Определение связи
  @JoinTable({ name: 'cartItem_id' })
  @Field(() => [CartItem])
  items?: CartItem[];
}

// @ManyToOne(() => Category, (category) => category.products, {
//   onDelete: 'CASCADE',
// })
// @JoinColumn({ name: 'category_id' })
