import * as request from 'supertest';
import { Test } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import { AppModule } from '../src/app.module';

describe('Purchases (e2e)', () => {
  let app: INestApplication;
  let adminToken: string;
  let productId: string;
  let supplierId: string;

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

    // obtener productos
    const productsRes = await request(app.getHttpServer())
      .get('/products')
      .set('Authorization', `Bearer ${adminToken}`);
    productId = productsRes.body.data[0].id;

    // obtener proveedores
    const suppliersRes = await request(app.getHttpServer())
      .get('/suppliers')
      .set('Authorization', `Bearer ${adminToken}`);
    supplierId = suppliersRes.body.data[0].id;
  });

  it('ADMIN puede crear compra y aumenta stock + registra gasto en caja', async () => {
    const res = await request(app.getHttpServer())
      .post('/purchases')
      .set('Authorization', `Bearer ${adminToken}`)
      .send({
        supplierId,
        items: [{ productId, qty: 2, price: 80 }],
      })
      .expect(201);

    expect(res.body.id).toBeDefined();
    expect(res.body.total).toBeGreaterThan(0);

    // check stock movements
    const stockRes = await request(app.getHttpServer())
      .get('/stock')
      .set('Authorization', `Bearer ${adminToken}`);
    expect(stockRes.body.some((m: any) => m.type === 'IN')).toBe(true);

    // check cash movements
    const cashRes = await request(app.getHttpServer())
      .get('/cash')
      .set('Authorization', `Bearer ${adminToken}`);
    expect(cashRes.body.some((m: any) => m.type === 'EXPENSE')).toBe(true);
  });

  afterAll(async () => {
    await app.close();
  });
});
