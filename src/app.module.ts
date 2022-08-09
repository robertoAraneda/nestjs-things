import { ClassSerializerInterceptor, Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ArticlesModule } from './articles/articles.module';
import { UsersModule } from './users/users.module';
import { PruebaModule } from './prueba/prueba.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { join } from 'path';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { AuthModule } from './auth/auth.module';
import { CaslModule } from './casl/casl.module';
import { RolesModule } from './roles/roles.module';
import { PermissionsModule } from './permissions/permissions.module';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'localhost',
      port: 5432,
      username: 'develop',
      password: 'develop',
      database: 'test-minsal',
      entities: [join(__dirname, '**', 'entities/*.entity.{ts,js}')],
      synchronize: true,
      autoLoadEntities: true,
      logging: 'all',
    }),
    ArticlesModule,
    UsersModule,
    PruebaModule,
    AuthModule,
    CaslModule,
    RolesModule,
    PermissionsModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_INTERCEPTOR,
      useClass: ClassSerializerInterceptor,
    },
  ],
})
export class AppModule {}
