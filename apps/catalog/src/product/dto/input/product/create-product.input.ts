import { Field, Float, InputType, Int } from '@nestjs/graphql';
import { IsDate, IsNotEmpty, IsNumber, IsString } from 'class-validator';

@InputType()
export class CreateProductInput {
  @Field()
  @IsNotEmpty()
  name: string;

  @Field({ nullable: true })
  @IsString()
  description?: string;

  @Field(() => Float)
  @IsNumber()
  price: number;

  @Field()
  @IsNotEmpty()
  @IsNumber()
  category_id: number;

  @Field()
  @IsString()
  image: string;

  @Field()
  @IsDate()
  created_at: string;

  @Field()
  @IsDate()
  updated_at: string;

  @Field(() => Int)
  @IsNumber()
  available_quantity: number;
}
