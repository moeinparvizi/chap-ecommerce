import { Module } from '@nestjs/common';
import { ProductsController } from './products.controller';
import { ProductsService } from './products.service';
import { PrismaModule } from '../prisma/prisma.module';
import { DiscountsModule } from '../discounts/discounts.module';
import { MarkupsModule } from '../markups/markups.module';
import { NotificationsModule } from '../notifications/notifications.module';

@Module({
  imports: [PrismaModule, DiscountsModule, MarkupsModule, NotificationsModule],
  controllers: [ProductsController],
  providers: [ProductsService],
})
export class ProductsModule {}
