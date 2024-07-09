import { config } from 'dotenv';
config();

interface IDatabaseConfig {
  host: string;
  port: number;
  user: string;
  password: string;
  name: string;
  connectionString: string;
  type: string;
  ssl: boolean;
}

const DatabaseConfig: IDatabaseConfig = {
  host: process.env.DB_HOST,
  port: Number(process.env.DB_PORT),
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  name: process.env.DB_NAME,
  connectionString: process.env.DB_CONNECTION_STRING,
  type: process.env.DB_TYPE,
  ssl: process.env.DB_SSL === 'true',
};

export default DatabaseConfig;
