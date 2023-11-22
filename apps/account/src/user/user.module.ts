import { Module } from '@nestjs/common';
import { UserResolver } from './user.resolver';
import { UserService } from './user.service';
import { UserRepository } from './user.repository';
import { DbModule } from '@app/db';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { JwtModule, JwtService } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';

import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModuleAsyncOptions } from '@nestjs/jwt';
import { JwtAuthGuard, JwtStrategy } from '@app/auth';
import { Cart } from 'apps/cart/src/cart/entities/cart.entity';
import { ClientsModule, Transport } from '@nestjs/microservices';

export const getJWTConfig = (): JwtModuleAsyncOptions => ({
  imports: [ConfigModule],
  inject: [ConfigService],
  useFactory: (configService: ConfigService) => ({
    secret: configService.get('JWT_ACCESS_TOKEN_SECRET'),
    global: true,
  }),
});

@Module({
  imports: [
    ConfigModule.forRoot(),
    JwtModule.registerAsync(getJWTConfig()),
    PassportModule,
    DbModule,
    TypeOrmModule.forFeature([User, Cart]),
    ClientsModule.registerAsync({
      clients: [
        {
          name: 'USER_CLIENT',
          imports: [ConfigModule],
          inject: [ConfigService],
          useFactory: () => ({
            transport: Transport.KAFKA,
            options: {
              client: {
                brokers: ['localhost:9092'],
                clientId: 'user-service',
              },
              consumer: {
                groupId: 'user-service-consumer',
              },
            },
          }),
        },
      ],
    }),
  ],
  providers: [
    UserResolver,
    UserService,
    UserRepository,
    JwtService,
    JwtStrategy,
    JwtAuthGuard,
  ],
})
export class UserModule {}
