import {
  ObjectType,
  Field,
  registerEnumType,
  ID,
  Float,
} from '@nestjs/graphql';
import { User } from './user.entity';
import { Cart } from './cart.entity';

export enum PaymentStatus {
  PAID = 'PAID',
  NOT_PAID = 'NOT_PAID',
}

enum OrderStatus {
  PENDING = 'PENDING',
  PROCESSING = 'PROCESSING',
  SHIPPED = 'SHIPPED',
  DELIVERED = 'DELIVERED',
}

registerEnumType(OrderStatus, {
  name: 'OrderStatus',
});

registerEnumType(PaymentStatus, {
  name: 'PaymentStatus',
});

@ObjectType()
export class Order {
  @Field(() => ID)
  id: string;

  @Field()
  paymentStatus: PaymentStatus;

  @Field(() => User)
  user: User;

  @Field(() => Cart)
  cart: Cart;

  @Field()
  shippingAddress: string;

  @Field(() => OrderStatus)
  status: OrderStatus;

  @Field(() => Float)
  total: number;

  @Field(() => Date)
  createdAt: Date;
}
