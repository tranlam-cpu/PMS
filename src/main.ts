import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  // const app = await NestFactory.create(AppModule, { cors: true });
  const app = await NestFactory.create(AppModule);
  app.enableCors({
    origin: 'http://localhost:4200',
    methods: ["GET","HEAD","OPTIONS","POST","PUT","PATCH","DELETE"],
    credentials: true,
  });
  //validation - use dto
  app.useGlobalPipes(new ValidationPipe({
    //loai bo cac phan tu ko dc xac dinh trong dto
    whitelist:true,
  }))
  await app.listen(3000);
}
bootstrap();
