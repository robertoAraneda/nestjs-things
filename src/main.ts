import { Logger, ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { swaggerConfig } from './swagger.config';
import helmet from 'helmet';
import { ConfigService } from '@nestjs/config';

async function bootstrap() {
  const logger = new Logger(AppModule.name);
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);
  app.useGlobalPipes(new ValidationPipe({ transform: true }));
  app.use(helmet());
  app.enableCors();

  swaggerConfig(app);

  const port = configService.get<number>('PORT');
  const dbName = configService.get<string>('DB_DATABASE');
  const env = configService.get<string>('NODE_ENV');

  logger.log('DB_DATABASE: ' + dbName);
  logger.log('NODE_ENV: ' + env);

  await app.listen(port);
}
bootstrap();
