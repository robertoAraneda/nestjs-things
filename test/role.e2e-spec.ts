import { Test, TestingModule } from '@nestjs/testing';
import { HttpStatus, INestApplication, ValidationPipe } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';
import { DataSource } from 'typeorm';
import { UsersService } from '../src/users/users.service';
import { User } from '../src/users/entities/user.entity';

describe('AppController (e2e)', () => {
  let app: INestApplication;
  let connection: DataSource;
  let userService: UsersService;
  let entity: User;

  const url = '/roles';

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    connection = app.get<DataSource>(DataSource);
    userService = app.get<UsersService>(UsersService);

    // await connection.synchronize(true);

    app.useGlobalPipes(new ValidationPipe({ transform: true }));

    entity = await userService.create({
      password: '12345',
      family: 'family',
      given: 'given',
    });
    await app.init();
  });

  it('/roles (GET)', () => {
    return request(app.getHttpServer())
      .get(url)
      .expect(HttpStatus.OK)
      .then(({ body }) => {
        console.log(entity);
        expect(body.length).toEqual(0);
      });
  });

  it('/roles (POST)', () => {
    return request(app.getHttpServer())
      .post(url)
      .send({
        code: '01',
        display: '',
      })
      .expect(HttpStatus.BAD_REQUEST)
      .then(({ body }) => {
        console.log(body);
        expect(body).toHaveProperty('code', '01');
        expect(body).toHaveProperty('display', 'display');
      });
  });
});
