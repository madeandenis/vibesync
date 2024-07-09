import { DataSource } from 'typeorm';
import { DatabaseConfig } from '../config';

// configuring the database connection outside the NestJS runtime
// for CLI tools and operations such as migrations and seeding
export const AppDataSource = new DataSource({
  type: DatabaseConfig.type as any,
  host: DatabaseConfig.host,
  port: DatabaseConfig.port,
  username: DatabaseConfig.user,
  password: DatabaseConfig.password,
  database: DatabaseConfig.name,
  entities: [`${__dirname}/../apps/backend/src/app/**/*.entity{.ts,.js}`],
  synchronize: process.env.NODE_ENV === 'development',
  logging: process.env.NODE_ENV === 'development',
  migrations: [`${__dirname}/migrations/*{.ts,.js}`],
  migrationsTableName: 'migrations',
});
