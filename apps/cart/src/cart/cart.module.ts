import { Module } from '@nestjs/common';
import { CartService } from './cart.service';
import { CartResolver } from './cart.resolver';
import { GraphQLModule } from '@nestjs/graphql';
import {
  ApolloFederationDriver,
  ApolloFederationDriverConfig,
} from '@nestjs/apollo';
import { DbModule } from '@app/db';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Cart } from './entities/cart.entity';
import { User } from './entities/user.entity';
import { CartItem } from './entities/cart-item';
import { CartController } from './cart.controller';
import { CartRepository } from './cart.repository';

@Module({
  imports: [
    DbModule,
    TypeOrmModule.forFeature([Cart, User, CartItem]),
    GraphQLModule.forRoot<ApolloFederationDriverConfig>({
      driver: ApolloFederationDriver,
      autoSchemaFile: {
        federation: 2,
      },
    }),
  ],
  controllers: [CartController],
  providers: [CartResolver, CartService, CartRepository],
})
export class CartModule {}
