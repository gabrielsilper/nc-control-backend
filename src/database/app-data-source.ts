import CorrectiveAction from 'entities/corrective-action';
import NonConformity from 'entities/non-conformity';
import User from 'entities/users';
import { DataSource } from 'typeorm';

export const appDataSource = new DataSource({
  type: 'postgres',
  host: process.env.DB_HOST as string,
  port: Number(process.env.DB_PORT as string) || 3030,
  username: process.env.DB_USER as string,
  password: process.env.DB_PASS as string,
  database: process.env.DB_NAME as string,

  entities: [CorrectiveAction, NonConformity, User],

  logging: true,
  synchronize: process.env.NODE_ENV !== 'production',
});
