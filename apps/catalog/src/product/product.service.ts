import { Injectable } from '@nestjs/common';
import { CreateProductInput } from './dto/input/product/create-product.input';
import { Product } from './entities/product.entity';
import { ProductRepository } from './product.repository';
import { CreateCategoryInput } from './dto/input/category/create-category.input';
import { Category } from './entities/category.entity';
import { GetProductArgs } from './dto/args/get-product.args';
import { UpdateProductInput } from './dto/input/product/update-product.input';
import { WinstonService } from '@app/winston/winston.service';

@Injectable()
export class ProductService {
  constructor(
    private readonly productRepository: ProductRepository,
    private readonly logger: WinstonService,
  ) {}

  public async createProduct(
    createProductInput: CreateProductInput,
  ): Promise<Product> {
    const product = await this.productRepository.create(createProductInput);

    this.logger.log(`Created prodict with ID ${product.id}`, 'ProductService');
    return product;
  }

  public async createCategory(name: string) {
    const category = await this.productRepository.createCategory(name);

    this.logger.log(
      `Created category with ID ${category.category_id}`,
      'ProductService',
    );
    return category;
  }

  public async findCategoryById(id: number) {
    this.logger.log(`Search category by ID`, 'ProductService');
    return await this.productRepository.findCategoryById(id);
  }

  public async getProductsByCategory(category_id: number) {
    this.logger.log(`Search product by Category`, 'ProductService');
    return await this.productRepository.getProductsByCategory(category_id);
  }

  public async getProductsById(product_id: number) {
    return await this.productRepository.getProductsById(product_id);
  }

  public async getProducts(): Promise<Product[]> {
    return await this.productRepository.findAll();
  }

  async createCategoryWithProducts(
    categoryData: CreateCategoryInput,
    products: CreateProductInput[],
  ): Promise<Category> {
    const createdCategory = await this.productRepository.createCategory(
      categoryData.name,
    );

    if (products && products.length > 0) {
      for (const product of products) {
        product.category_id = createdCategory.category_id;
        await this.createProduct(product);
      }
    }

    createdCategory.products =
      await this.productRepository.getProductsByCategory(
        createdCategory.category_id,
      );

    this.logger.log(
      `Created category with ID ${createdCategory.category_id}`,
      'ProductService',
    );
    return createdCategory;
  }

  public async getProductByName(
    getProductArgs: GetProductArgs,
  ): Promise<Product> {
    return await this.productRepository.getProductByName(getProductArgs.name);
  }

  public async updateProduct(
    updateProductInput: UpdateProductInput,
  ): Promise<Product> {
    const { id, category_id } = updateProductInput;

    const existingProduct = await this.productRepository.getProductById(id);
    if (!existingProduct) {
      this.logger.warn(
        `Product with such ID ${existingProduct.id} alrady exist`,
        'ProductService',
      );
      return null;
    }
    if (category_id) {
      await this.productRepository.updateProductCategory(id, category_id);
    }
    return this.productRepository.updateProduct(updateProductInput);
  }

  public async deleteProduct(id: number) {
    const existingProduct = await this.productRepository.getProductById(id);
    if (!existingProduct) {
      return null;
    }
    this.productRepository.deleteProduct(existingProduct.id);
    return existingProduct;
  }

  public async deleteCategory(id: number) {
    const existingCategoty = await this.productRepository.findCategoryById(id);
    if (!existingCategoty) {
      return null;
    }
    this.productRepository.deleteCategory(existingCategoty.category_id);
    return existingCategoty;
  }

  // public getProductById(id: string): Product {
  //   return this.products.find((product) => product.id === id);
  // }

  // public deleteProduct(deleteProductInput: DeleteProductInput): Product {
  //   const productIndex = this.products.findIndex(
  //     (product) => product.id === deleteProductInput.product_id,
  //   );

  //   const user = this.products[productIndex];

  //   this.products.splice(productIndex);

  //   return user;
  // }
}
