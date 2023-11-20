import {
  Args,
  Mutation,
  Query,
  ResolveReference,
  Resolver,
} from '@nestjs/graphql';
import { GetProductArgs } from './dto/args/get-product.args';
import { CreateProductInput } from './dto/input/product/create-product.input';
import { DeleteProductInput } from './dto/input/product/delete-product.input';
import { UpdateProductInput } from './dto/input/product/update-product.input';
import { Product } from './entities/product.entity';
import { ProductService } from './product.service';

@Resolver(() => Product)
export class ProductResolver {
  constructor(private readonly productService: ProductService) {}

  @Mutation(() => Product)
  async createProduct(
    @Args('CreateProductInput') createProductInput: CreateProductInput,
  ): Promise<Product> {
    return await this.productService.createProduct(createProductInput);
  }

  @Query(() => [Product], { name: 'getProducts', nullable: 'items' })
  async getProducts(): Promise<Product[]> {
    return await this.productService.getProducts();
  }

  @Query(() => Product, { name: 'getProduct', nullable: true })
  async getProduct(@Args() getProductArgs: GetProductArgs): Promise<Product> {
    return await this.productService.getProductByName(getProductArgs);
  }

  @Mutation(() => Product)
  async updateProduct(
    @Args('updateProductInput') updateProductInput: UpdateProductInput,
  ): Promise<Product> {
    return this.productService.updateProduct(updateProductInput);
  }

  @Mutation(() => Product)
  async deleteProduct(
    @Args('DeleteProductInput') deleteProductInput: DeleteProductInput,
  ): Promise<Product> {
    return await this.productService.deleteProduct(deleteProductInput.id);
  }

  // @ResolveReference()
  // async resolveReference(reference: {
  //   __typename: string;
  //   category_id: number;
  // }) {
  //   const res = await this.productService.findCategoryById(
  //     reference.category_id,
  //   );
  //   console.log(res);
  //   return res;
  // }
  @ResolveReference()
  resolveReference(reference: { __typename: string; id: number }) {
    return this.productService.getProductsById(reference.id);
  }
}
