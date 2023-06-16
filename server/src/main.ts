import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { verify } from './verification.middleware';

const port = process.env.PORT || 3000;

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors();
  app.use(verify);
  await app.listen(port, '0.0.0.0');
}
bootstrap();
