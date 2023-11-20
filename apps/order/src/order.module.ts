import { Module } from '@nestjs/common';
import { OrderController } from './order.controller';
import { OrderService } from './order.service';
import { OrderModule } from './order/order.module';

@Module({
  imports: [OrderModule],
  controllers: [OrderController],
  providers: [OrderService],
})
export class OrderModule {}
