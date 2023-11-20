import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Product } from './entities/product.entity';
import { Repository } from 'typeorm';
import { CreateProductInput } from './dto/input/product/create-product.input';
import { Category } from './entities/category.entity';
import { UpdateProductInput } from './dto/input/product/update-product.input';

@Injectable()
export class ProductRepository {
  constructor(
    @InjectRepository(Product)
    private productRepository: Repository<Product>,
    @InjectRepository(Category)
    private categotyRepository: Repository<Category>,
  ) {}

  async findAll(): Promise<Product[]> {
    const prod = await this.productRepository.find({ relations: ['category'] });
    return prod;
  }

  async create(createProductInput: CreateProductInput): Promise<Product> {
    const { category_id, ...productData } = createProductInput;

    const categoryById = await this.categotyRepository.findOneBy({
      category_id,
    });
    const category = new Category();
    category.category_id = category_id;
    category.category_name = categoryById.category_name;

    const product = this.productRepository.create({
      ...productData,
      category: category,
    });

    await this.productRepository.save(product);
    return product;
  }

  async createCategory(category_name: string) {
    const category = this.categotyRepository.create({ category_name });
    await this.categotyRepository.save(category);
    return category;
  }

  async findCategoryById(category_id: number) {
    return this.categotyRepository.findOneBy({ category_id });
  }

  async getProductsByCategory(category_id: number) {
    return await this.productRepository.find({
      where: { category: { category_id: category_id } },
    });
  }

  async getProductsById(id: number) {
    return await this.productRepository.findOne({
      where: { id: id },
    });
  }

  async getProductByName(name: string) {
    return await this.productRepository.findOne({
      where: { name: name },
      relations: ['category'],
    });
  }

  async getProductById(id: number) {
    return await this.productRepository.findOne({
      where: { id: id },
      relations: ['category'],
    });
  }

  async updateProduct(
    updateProductInput: UpdateProductInput,
  ): Promise<Product | null> {
    const { id, category_id, ...updateData } = updateProductInput;

    const category = new Category();
    category.category_id = category_id;

    await this.productRepository.update(id, updateData);

    const updatedProduct = await this.productRepository.findOne({
      where: { id: id },
      relations: ['category'],
    });

    return updatedProduct || null;
  }

  async updateProductCategory(
    product_id: number,
    category_id: number,
  ): Promise<void> {
    await this.productRepository
      .createQueryBuilder()
      .relation(Product, 'category')
      .of(product_id)
      .set(category_id);
  }

  async deleteProduct(id: number) {
    await this.productRepository.delete(id);
  }

  async deleteCategory(id: number) {
    await this.categotyRepository.delete(id);
  }
}
