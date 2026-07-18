import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ThrottlerModule } from '@nestjs/throttler';
import { PrismaModule } from './prisma/prisma.module';
import { HealthModule } from './health/health.module';
import { ProductsModule } from './products/products.module';
import { CategoriesModule } from './categories/categories.module';
import { OrdersModule } from './orders/orders.module';
import { MarketingModule } from './marketing/marketing.module';
import { CustomersModule } from './customers/customers.module';

import { CommentsModule } from './comments/comments.module';
import { ReviewsModule } from './reviews/reviews.module';
import { LocationsModule } from './locations/locations.module';
import { ProfileModule } from './profile/profile.module';
import { AuthModule } from './auth/auth.module';
import { DiscountsModule } from './discounts/discounts.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    ThrottlerModule.forRoot([{ ttl: 60000, limit: 100 }]),
    PrismaModule,
    HealthModule,
    ProductsModule,
    CategoriesModule,
    OrdersModule,
    MarketingModule,
    CustomersModule,
    CommentsModule,
    ReviewsModule,
    LocationsModule,
    ProfileModule,
    AuthModule,
    DiscountsModule,
  ],
})
export class AppModule {}
