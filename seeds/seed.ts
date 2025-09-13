import 'dotenv/config';
import { DataSource } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { User } from '../src/auth/entities/user.entity';
import { Product } from '../src/products/entities/product.entity';
import { Customer } from '../src/customers/entities/customer.entity';
import { Supplier } from '../src/suppliers/entities/supplier.entity';
import { Order } from '../src/orders/entities/order.entity';
import { OrderItem } from '../src/orders/entities/order-item.entity';
import { Purchase } from '../src/purchases/entities/purchase.entity';
import { PurchaseItem } from '../src/purchases/entities/purchase-item.entity';

const AppDataSource = new DataSource({
  type: process.env.DB_TYPE as any || 'postgres',
  host: process.env.PG_HOST,
  port: Number(process.env.PG_PORT),
  username: process.env.PG_USER,
  password: String(process.env.PG_PASS),
  database: process.env.PG_DB,
  entities: [User, Product, Customer, Supplier, Order, OrderItem, Purchase, PurchaseItem],
});

async function run() {
  await AppDataSource.initialize();

  // --- Users ---
  const userRepo = AppDataSource.getRepository(User);

  let admin = await userRepo.findOne({ where: { email: 'admin@local.com' } });
  if (!admin) {
    admin = userRepo.create({
      email: 'admin@local.com',
      passwordHash: await bcrypt.hash('admin', 10),
      role: 'ADMIN',
    });
    await userRepo.save(admin);
    console.log('✅ Admin creado: admin@local.com / admin');
  }

  let user = await userRepo.findOne({ where: { email: 'user@local.com' } });
  if (!user) {
    user = userRepo.create({
      email: 'user@local.com',
      passwordHash: await bcrypt.hash('user', 10),
      role: 'USER',
    });
    await userRepo.save(user);
    console.log('✅ Usuario creado: user@local.com / user');
  }

  // --- Products ---
  const productRepo = AppDataSource.getRepository(Product);
  let coca = await productRepo.findOne({ where: { sku: 'P-001' } });
  if (!coca) {
    coca = await productRepo.save(
      productRepo.create({
        sku: 'P-001',
        name: 'Coca Cola 500ml',
        price: 120,
        cost: 80,
        stock: 50,
        stockMin: 5,
      }),
    );
  }

  let lays = await productRepo.findOne({ where: { sku: 'P-002' } });
  if (!lays) {
    lays = await productRepo.save(
      productRepo.create({
        sku: 'P-002',
        name: 'Papas Lays 100g',
        price: 200,
        cost: 120,
        stock: 30,
        stockMin: 5,
      }),
    );
  }

  console.log('✅ Productos disponibles:', [coca.name, lays.name]);

  // --- Customers ---
  const customerRepo = AppDataSource.getRepository(Customer);
  let juan = await customerRepo.findOne({ where: { email: 'juan@test.com' } });
  if (!juan) {
    juan = await customerRepo.save(
      customerRepo.create({
        name: 'Juan Pérez',
        email: 'juan@test.com',
        phone: '123456',
        address: 'Calle Falsa 123',
        balance: 0,
      }),
    );
  }

  let maria = await customerRepo.findOne({ where: { email: 'maria@test.com' } });
  if (!maria) {
    maria = await customerRepo.save(
      customerRepo.create({
        name: 'María Gomez',
        email: 'maria@test.com',
        phone: '654321',
        address: 'Av. Principal 456',
        balance: 0,
      }),
    );
  }

  console.log('✅ Clientes disponibles:', [juan.name, maria.name]);

  // --- Suppliers ---
  const supplierRepo = AppDataSource.getRepository(Supplier);
  let norte = await supplierRepo.findOne({ where: { email: 'norte@proveedor.com' } });
  if (!norte) {
    norte = await supplierRepo.save(
      supplierRepo.create({
        name: 'Distribuidora Norte',
        phone: '111111',
        email: 'norte@proveedor.com',
        address: 'Depósito Norte 12',
      }),
    );
  }

  let sur = await supplierRepo.findOne({ where: { email: 'sur@proveedor.com' } });
  if (!sur) {
    sur = await supplierRepo.save(
      supplierRepo.create({
        name: 'Almacén Mayorista Sur',
        phone: '222222',
        email: 'sur@proveedor.com',
        address: 'Depósito Sur 34',
      }),
    );
  }

  console.log('✅ Proveedores disponibles:', [norte.name, sur.name]);

  // --- Orders (ejemplo de USER) ---
  const orderRepo = AppDataSource.getRepository(Order);
  const orderItemRepo = AppDataSource.getRepository(OrderItem);
  if ((await orderRepo.count()) === 0) {
    const order = orderRepo.create({
      customer: juan,
      status: 'PENDIENTE',
      subtotal: coca.price * 2,
      total: coca.price * 2,
      discount: 0,
      items: [
        orderItemRepo.create({
          product: coca,
          qty: 2,
          price: coca.price,
          subtotal: coca.price * 2,
        }),
      ],
    });
    await orderRepo.save(order);
    console.log('✅ Pedido inicial creado para Juan Pérez (2x Coca Cola)');
  }

  // --- Purchases (ejemplo de ADMIN) ---
  const purchaseRepo = AppDataSource.getRepository(Purchase);
  const purchaseItemRepo = AppDataSource.getRepository(PurchaseItem);
  if ((await purchaseRepo.count()) === 0) {
    const purchase = purchaseRepo.create({
      supplier: norte,
      total: lays.cost * 10,
      items: [
        purchaseItemRepo.create({
          product: lays,
          qty: 10,
          price: lays.cost,
          subtotal: lays.cost * 10,
        }),
      ],
    });
    await purchaseRepo.save(purchase);
    console.log('✅ Compra inicial registrada (10x Lays a Distribuidora Norte)');
  }

  await AppDataSource.destroy();
  console.log('🎉 Seed extendido finalizado con éxito');
}

run().catch((err) => {
  console.error('❌ Error en seed extendido:', err);
  AppDataSource.destroy();
});
