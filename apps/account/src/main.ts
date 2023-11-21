import { NestFactory } from '@nestjs/core';
import { AccountModule } from './account.module';
import * as cookieParser from 'cookie-parser';
import { NestExpressApplication } from '@nestjs/platform-express';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AccountModule, {
    cors: true,
  });

  const microservice = app.connectMicroservice<MicroserviceOptions>({
    transport: Transport.KAFKA,
    options: {
      client: {
        brokers: ['localhost:9092'],
        // clientId: 'user-service',
      },
      consumer: {
        groupId: 'user-service-consumer',
      },
    },
  });

  await microservice.listen();

  app.use(cookieParser());
  app.enableCors();
  await app.listen(3003);
}
bootstrap();
