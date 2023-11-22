import {
  Inject,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { CreateUserInput } from './dto/input/create-user.input';
import { User } from './entities/user.entity';

import { JwtPayload } from '@app/auth';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { compare, genSalt, hash } from 'bcryptjs';
import { GraphQLError } from 'graphql';
import { LoginUserInput } from './dto/input/login-user.input';
import { ERROR_MESSAGES } from './user.constants';
import { UserRepository } from './user.repository';
import { ClientKafka } from '@nestjs/microservices';
import { firstValueFrom, lastValueFrom } from 'rxjs';
import { Cart } from 'apps/cart/src/cart/entities/cart.entity';

@Injectable()
export class UserService {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
    @Inject('USER_CLIENT') private kafkaClient: ClientKafka,
  ) {}

  async onModuleInit() {
    this.kafkaClient.subscribeToResponseOf('create_cart');
    this.kafkaClient.subscribeToResponseOf('search_cart');
    await this.kafkaClient.connect();
  }

  async getCartByUserId(user_id: number) {
    const cartResponse: Cart = await lastValueFrom(
      this.kafkaClient.send('search_cart', { user_id: user_id }),
    );
    console.log(cartResponse);
    return cartResponse;
  }

  async createCart(user: User) {
    return await firstValueFrom(
      this.kafkaClient.send('create_cart', { user: user }),
    );
  }

  async findUserById(user_id: number) {
    return this.userRepository.findUserById(user_id);
  }

  async register(createUserInput: CreateUserInput): Promise<User> {
    const oldUser = await this.userRepository.findUserByEmail(
      createUserInput.email,
    );

    if (oldUser) {
      throw new GraphQLError('USER_ALREADY_EXISTS');
      // new ConflictException(ERROR_MESSAGES.USER_ALREADY_EXISTS),
    }

    const salt = await genSalt(10);
    const hashedPassword = await hash(createUserInput.password, salt);
    const newUser = await this.userRepository.createUser(
      createUserInput,
      hashedPassword,
    );

    // await this.kafkaService.sendMessage('user.created', {
    //   user_id: newUser.user_id,
    // });

    return newUser;
  }

  async findUserByCartId(id: number) {
    return await this.userRepository.findUserByCartId(id);
  }
  async findAll(): Promise<User[]> {
    return await this.userRepository.findAll();
  }

  public getCookieWithJwtAccessToken(user_id: number): Promise<string> {
    const payload = { user_id };
    const token = this.jwtService.signAsync(payload, {
      secret: this.configService.get('JWT_ACCESS_TOKEN_SECRET'),
      expiresIn: `${this.configService.get(
        'JWT_ACCESS_TOKEN_EXPIRATION_TIME',
      )}s`,
    });
    return token;
  }

  public getCookieWithJwtRefreshToken(user_id: number): Promise<string> {
    const payload = { user_id };
    const token = this.jwtService.signAsync(payload, {
      secret: this.configService.get('JWT_REFRESH_TOKEN_SECRET'),
      expiresIn: `${this.configService.get(
        'JWT_REFRESH_TOKEN_EXPIRATION_TIME',
      )}s`,
    });

    return token;
  }

  async login(loginUserInput: LoginUserInput) {
    const { email, password } = loginUserInput;
    const { user_id } = await this.validateUser(email, password);
    const access_token = await this.getCookieWithJwtAccessToken(user_id);
    //const refresh_token = await this.getCookieWithJwtRefreshToken(user_id);

    // const user = await this.setCurrentRefreshToken(refresh_token, id);

    const user = await this.userRepository.findUserById(user_id);
    // console.log(access_token);
    // res.cookie('access_token', access_token);
    // console.log(res);
    //res.cookie(REFRESH_TOKEN, refresh_token);

    return { user, access_token };
    // return {
    //   access_token: access_token,
    //   //refresh_token: refresh_token,
    //   user: user,
    // };
  }

  // async setCurrentRefreshToken(refreshToken: string, userId: number) {
  //   const currentHashedRefreshToken = await hash(refreshToken, 10);

  //   const user = await this.userRepository.setCurrentRefreshToken(
  //     userId,
  //     currentHashedRefreshToken,
  //   );
  //   return user;
  // }

  async validateUser(
    email: string,
    password: string,
  ): Promise<{ user_id: number }> {
    const user = await this.userRepository.findUserByEmail(email);

    if (!user) {
      new NotFoundException(ERROR_MESSAGES.USER_NOT_FOUND);
    }

    const isCorrectPassword = await compare(password, user.passwordHash);

    if (!isCorrectPassword) {
      new UnauthorizedException(ERROR_MESSAGES.WRONG_PASSWORD);
    }

    return {
      user_id: user.user_id,
    };
  }

  /// Test ///
  async validateJwtPayload(payload: JwtPayload): Promise<User | undefined> {
    // This will be used when the user has already logged in and has a JWT
    const user = await this.userRepository.findUserById(payload.user_id);

    // Ensure the user exists and their account isn't disabled
    if (user) {
      return user;
    }

    return undefined;
  }
}
