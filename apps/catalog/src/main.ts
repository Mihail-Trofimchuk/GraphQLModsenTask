import { NestFactory } from '@nestjs/core';
import { ProductModule } from './product/product.module';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';

async function bootstrap() {
  const app = await NestFactory.create(ProductModule);
  await app.listen(3002);

  const microservice = app.connectMicroservice<MicroserviceOptions>({
    transport: Transport.KAFKA,
    options: {
      client: {
        brokers: ['localhost:9092'],
        // clientId: 'user-service',
      },
      consumer: {
        groupId: 'catalog-service-consumer',
      },
    },
  });

  await microservice.listen();
}
bootstrap();
