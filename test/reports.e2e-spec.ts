import * as request from 'supertest';
import { Test } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import { AppModule } from '../src/app.module';

describe('Reports (e2e)', () => {
  let app: INestApplication;
  let token: string;

  beforeAll(async () => {
    const moduleFixture = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();

    // login admin
    const res = await request(app.getHttpServer())
      .post('/auth/login')
      .send({ email: 'admin@local.com', password: 'admin' });

    token = res.body.access_token;
  });

  it('/reports/sales (GET)', async () => {
    const res = await request(app.getHttpServer())
      .get('/reports/sales')
      .set('Authorization', `Bearer ${token}`)
      .expect(200);

    expect(res.body.total).toBeDefined();
  });

  it('/reports/products/top (GET)', async () => {
    const res = await request(app.getHttpServer())
      .get('/reports/products/top')
      .set('Authorization', `Bearer ${token}`)
      .expect(200);

    expect(Array.isArray(res.body)).toBe(true);
  });

  it('/reports/stock/critical (GET)', async () => {
    const res = await request(app.getHttpServer())
      .get('/reports/stock/critical')
      .set('Authorization', `Bearer ${token}`)
      .expect(200);

    expect(Array.isArray(res.body)).toBe(true);
  });

  afterAll(async () => {
    await app.close();
  });
});
