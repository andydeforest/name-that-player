import { ServerModule } from './server.module';
import { NestFactory } from '@nestjs/core';

const port = process.env.PORT || 3000;

async function bootstrap() {
  const app = await NestFactory.create(ServerModule);
  app.enableCors();
  await app.listen(port, '0.0.0.0');
}
bootstrap();
