import { DataSourceOptions } from 'typeorm';
import { config } from 'dotenv';
config();

const common: Partial<DataSourceOptions> = {
  entities: [__dirname + '/../**/*.entity{.ts,.js}'],
  migrations: [__dirname + '/../../migrations/*{.ts,.js}'],
  synchronize: true,
  logging: false,
};

const dbType = process.env.DB_TYPE ?? 'sqlite';

let options: DataSourceOptions;
if (dbType === 'postgres') {
  options = {
    type: 'postgres',
    host: process.env.PG_HOST,
    port: Number(process.env.PG_PORT || 5432),
    username: process.env.PG_USER,
    password: process.env.PG_PASS,
    database: process.env.PG_DB,
    ...common,
  } as DataSourceOptions;
} else {
  options = {
    type: 'sqlite',
    database: process.env.SQLITE_DB || 'toxic.db',
    ...common,
  } as DataSourceOptions;
}

export default options;
