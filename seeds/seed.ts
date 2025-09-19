import { DataSource } from 'typeorm';
import { Product } from '../src/products/entities/product.entity';
import { Customer } from '../src/customers/entities/customer.entity';
import { Supplier } from '../src/suppliers/entities/supplier.entity';
import { Order } from '../src/orders/entities/order.entity';
import { OrderItem } from '../src/orders/entities/order-item.entity';
import { Cashbox, CashboxStatus } from '../src/cash/entities/cashbox.entity';

export const seedDatabase = async (dataSource: DataSource) => {
  const productRepo = dataSource.getRepository(Product);
  const customerRepo = dataSource.getRepository(Customer);
  const supplierRepo = dataSource.getRepository(Supplier);
  const orderRepo = dataSource.getRepository(Order);
  const orderItemRepo = dataSource.getRepository(OrderItem);
  const cashboxRepo = dataSource.getRepository(Cashbox);

  console.log('🌱 Seeding database...');

  // ---------- Productos ----------
  const rawProducts = [
    { name: 'Coca Cola 500ml', price: 800, stock: 100 },
    { name: 'Pepsi 500ml', price: 750, stock: 80 },
    { name: 'Fanta 500ml', price: 780, stock: 60 },
    { name: 'Agua 1.5L', price: 600, stock: 120 },
  ];

  const products = productRepo.create(
    rawProducts.map((p, i) => ({
      ...p,
      sku: `SKU-${i + 1}`, // 👈 Generamos SKU automáticamente
    }))
  );
  await productRepo.save(products);

  // ---------- Clientes ----------
  const customers = customerRepo.create([
    { name: 'Juan Pérez', phone: '111-222-333', email: 'juan@example.com', balance: '0.00' },
    { name: 'María Gómez', phone: '222-333-444', email: 'maria@example.com', balance: '0.00' },
  ]);
  await customerRepo.save(customers);

  // ---------- Proveedores ----------
  const suppliers = supplierRepo.create([
    { name: 'Distribuidora Norte', phone: '444-555-666', email: 'norte@example.com' },
    { name: 'Bebidas Express', phone: '555-666-777', email: 'express@example.com' },
  ]);
  await supplierRepo.save(suppliers);

  // ---------- Pedido de ejemplo ----------
  const order = orderRepo.create({
    status: 'PENDIENTE',
    subtotal: 1600,
    discount: 0,
    total: 1600,
    notes: 'Pedido inicial',
    customer: customers[0],
  });
  await orderRepo.save(order);

  const orderItems = orderItemRepo.create([
    { order, product: products[0], qty: 2, price: 800, subtotal: 1600 },
  ]);
  await orderItemRepo.save(orderItems);

  // ---------- Caja inicial ----------
  const openCash = cashboxRepo.create({
    status: CashboxStatus.OPEN,
    openingAmount: '10000.00',
    closingAmount: '0.00',
    openedAt: new Date(),
    notes: 'Caja inicial de prueba',
  });
  await cashboxRepo.save(openCash);

  console.log('✅ Seeding complete! Caja inicial creada con $10.000.');
};
