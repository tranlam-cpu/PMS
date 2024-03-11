import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { PrismaModule } from './prisma/prisma.module';

import { AuthModule } from './auth/auth.module';
import { ProductController } from './product/product.controller';
import { ProductService } from './product/product.service';
import { ProductModule } from './product/product.module';
import { CategoryController } from './category/category.controller';
import { CategoryModule } from './category/category.module';
import { CategoryService } from './category/category.service';



@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal:true,
      envFilePath: '.dev.env',
    }),
    PrismaModule,
    AuthModule,
    ProductModule,
    CategoryModule,
  ],
  controllers: [ProductController, CategoryController],
  providers: [ProductService, CategoryService],
})
export class AppModule {}
