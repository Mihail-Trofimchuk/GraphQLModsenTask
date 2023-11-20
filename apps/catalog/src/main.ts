import { NestFactory } from '@nestjs/core';
import { ProductModule } from './product/product.module';

async function bootstrap() {
  const app = await NestFactory.create(ProductModule);
  await app.listen(3002);
}
bootstrap();
