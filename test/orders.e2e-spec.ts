import * as request from 'supertest';
import { Test } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import { AppModule } from '../src/app.module';

describe('Orders (e2e)', () => {
  let app: INestApplication;
  let adminToken: string;
  let userToken: string;
  let productId: string;
  let orderId: string;

  beforeAll(async () => {
    const moduleFixture = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();

    // login admin
    const adminRes = await request(app.getHttpServer())
      .post('/auth/login')
      .send({ email: 'admin@local.com', password: 'admin' });
    adminToken = adminRes.body.access_token;

    // login user
    const userRes = await request(app.getHttpServer())
      .post('/auth/login')
      .send({ email: 'user@local.com', password: 'user' });
    userToken = userRes.body.access_token;

    // obtener productos
    const productsRes = await request(app.getHttpServer())
      .get('/products')
      .set('Authorization', `Bearer ${adminToken}`);
    productId = productsRes.body.data[0].id; // tomo el primero
  });

  it('USER puede crear orden', async () => {
    const res = await request(app.getHttpServer())
      .post('/orders')
      .set('Authorization', `Bearer ${userToken}`)
      .send({
        items: [{ productId, qty: 1, price: 120 }],
      })
      .expect(201);

    expect(res.body.id).toBeDefined();
    expect(res.body.status).toBe('PENDIENTE');
    orderId = res.body.id;
  });

  it('ADMIN confirma orden y descuenta stock + registra ingreso en caja', async () => {
    const res = await request(app.getHttpServer())
      .post(`/orders/${orderId}/confirm`)
      .set('Authorization', `Bearer ${adminToken}`)
      .expect(201);

    expect(res.body.ok).toBe(true);

    // check stock movements
    const stockRes = await request(app.getHttpServer())
      .get('/stock')
      .set('Authorization', `Bearer ${adminToken}`);
    expect(stockRes.body.length).toBeGreaterThan(0);

    // check cash movements
    const cashRes = await request(app.getHttpServer())
      .get('/cash')
      .set('Authorization', `Bearer ${adminToken}`);
    expect(cashRes.body.some((m: any) => m.type === 'INCOME')).toBe(true);
  });

  afterAll(async () => {
    await app.close();
  });
});
