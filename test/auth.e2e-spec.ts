import * as request from 'supertest';
import { Test } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import { AppModule } from '../src/app.module';

describe('Auth (e2e)', () => {
  let app: INestApplication;

  beforeAll(async () => {
    const moduleFixture = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  it('/auth/login (POST) - admin correcto', async () => {
    const res = await request(app.getHttpServer())
      .post('/auth/login')
      .send({ email: 'admin@local.com', password: 'admin' })
      .expect(201);

    expect(res.body.access_token).toBeDefined();
  });

  it('/auth/login (POST) - credenciales inválidas', async () => {
    return request(app.getHttpServer())
      .post('/auth/login')
      .send({ email: 'fake@test.com', password: 'wrong' })
      .expect(401);
  });

  afterAll(async () => {
    await app.close();
  });
});
