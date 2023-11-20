import {
  ApolloFederationDriver,
  ApolloFederationDriverConfig,
} from '@nestjs/apollo';
import { Module } from '@nestjs/common';
import { GraphQLModule } from '@nestjs/graphql';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DbModule } from '../../../../libs/db/src/db.module';
import { CategoryResolver } from './category.resolver';
import { Category } from './entities/category.entity';
import { Product } from './entities/product.entity';
import { ProductRepository } from './product.repository';
import { ProductResolver } from './product.resolver';
import { ProductService } from './product.service';
import { WinstonModule } from '@app/winston';

@Module({
  imports: [
    TypeOrmModule.forFeature([Product, Category]),
    DbModule,
    WinstonModule,
    GraphQLModule.forRoot<ApolloFederationDriverConfig>({
      driver: ApolloFederationDriver,
      typePaths: ['**/*.graphql'],
      // autoSchemaFile: {
      //   federation: 2,
      // },
    }),
  ],
  providers: [
    ProductResolver,
    CategoryResolver,
    ProductService,
    ProductRepository,
  ],
  exports: [],
})
export class ProductModule {}
