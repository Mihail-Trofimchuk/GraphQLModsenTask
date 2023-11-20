import { Directive, Field, ID, ObjectType } from '@nestjs/graphql';
import { Order } from './order.entity';

@ObjectType()
@Directive('@key(fields: "id")')
export class User {
  @Field(() => ID)
  id: string;

  @Field(() => [Order], { nullable: true })
  order?: Order[];
}
