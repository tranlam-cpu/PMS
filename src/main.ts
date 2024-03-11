import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  //validation - use dto
  app.useGlobalPipes(new ValidationPipe({
    //loai bo cac phan tu ko dc xac dinh trong dto
    whitelist:true,
  }))
  await app.listen(3000);
}
bootstrap();
