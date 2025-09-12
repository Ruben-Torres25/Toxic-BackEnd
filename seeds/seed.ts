import 'reflect-metadata';
import { DataSource } from 'typeorm';
import options from '../src/config/ormconfig';
import { User } from '../src/auth/entities/user.entity';
import * as bcrypt from 'bcrypt';

(async () => {
  const ds = new DataSource(options);
  await ds.initialize();
  const repo = ds.getRepository(User);
  const exists = await repo.findOne({ where: { email: 'admin@local' } });
  if (!exists) {
    const u = repo.create({ email: 'admin@local', passwordHash: await bcrypt.hash('admin', 10), role: 'ADMIN' });
    await repo.save(u);
    console.log('Admin creado: admin@local / admin');
  } else {
    console.log('Admin ya existe');
  }
  await ds.destroy();
})();
