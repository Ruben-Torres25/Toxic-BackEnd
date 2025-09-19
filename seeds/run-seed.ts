import { AppDataSource } from '../src/config/ormconfig';
import { seedDatabase } from './seed';

AppDataSource.initialize()
  .then(async () => {
    console.log('DB connected ✅');
    await seedDatabase(AppDataSource);
    await AppDataSource.destroy();
  })
  .catch(err => {
    console.error('Error seeding database ❌', err);
  });
