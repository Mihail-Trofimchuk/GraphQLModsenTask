import { Field, InputType } from '@nestjs/graphql';
import { Type } from 'class-transformer';
import { IsArray, IsNotEmpty, IsString, ValidateNested } from 'class-validator';
import { CreateProductInput } from '../product/create-product.input';

@InputType()
export class CreateCategoryInput {
  @Field()
  @IsNotEmpty()
  @IsString()
  name: string;

  @Field(() => [CreateProductInput], { nullable: true })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateProductInput)
  products?: CreateProductInput[];
}
