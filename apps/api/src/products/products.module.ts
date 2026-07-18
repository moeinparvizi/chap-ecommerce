import { Module } from '@nestjs/common';
import { ProductsController } from './products.controller';
import { ProductsService } from './products.service';
import { PrismaModule } from '../prisma/prisma.module';
import { DiscountsModule } from '../discounts/discounts.module';

@Module({
  imports: [PrismaModule, DiscountsModule],
  controllers: [ProductsController],
  providers: [ProductsService],
})
export class ProductsModule {}
