import CorrectiveAction from 'entities/corrective-action';
import NcYearSequence from 'entities/nc-year-sequence';
import NonConformity from 'entities/non-conformity';
import RefreshToken from 'entities/refresh-token';
import User from 'entities/user';
import { DataSource } from 'typeorm';

export const appDataSource = new DataSource({
  type: 'postgres',
  host: process.env.DB_HOST as string,
  port: Number(process.env.DB_PORT as string) || 3030,
  username: process.env.DB_USER as string,
  password: process.env.DB_PASS as string,
  database: process.env.DB_NAME as string,

  entities: [CorrectiveAction, NcYearSequence, NonConformity, User, RefreshToken],

  logging: true,
  synchronize: process.env.NODE_ENV !== 'production',
});
