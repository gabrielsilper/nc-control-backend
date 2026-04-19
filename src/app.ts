import 'reflect-metadata';
import { getEnvOrThrow } from 'config/environment';
import cors from 'cors';
import { appDataSource } from 'database/app-data-source';
import express from 'express';
import rateLimit from 'express-rate-limit';
import { errorHandler } from 'middlewares/error-handler.middleware';
import morgan from 'morgan';
import indexRoutes from 'routes/index.routes';
import type { DataSource } from 'typeorm';

const FRONTEND_URL = getEnvOrThrow('FRONTEND_URL');

export default class App {
  public readonly server: express.Express;
  public readonly db: DataSource;

  constructor() {
    this.server = express();
    this.db = appDataSource;
    this.config();
    this.routes();
    this.errorHandling();
  }

  private config(): void {
    this.server.use(
      cors({
        origin: FRONTEND_URL,
        methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
        credentials: true,
        optionsSuccessStatus: 200,
      }),
    );
    this.server.use(express.json());
    this.server.use(morgan('common'));
    this.server.use(
      rateLimit({
        windowMs: 15 * 60 * 1000,
        max: 100,
        standardHeaders: true,
        legacyHeaders: false,
      }),
    );
  }

  private routes(): void {
    this.server.get('/api/v1/live', (_req, res) => {
      res.send('Non Conformity Control v1 is live!');
    });
    this.server.use('/api/v1', indexRoutes);
  }

  private errorHandling(): void {
    this.server.use(errorHandler);
  }

  public start(PORT: string | number): void {
    this.db
      .initialize()
      .then(() => {
        console.log('Initialized database connection successfully.');
        this.server.listen(PORT, () => {
          console.log(`Server is running on port ${PORT}`);
        });
      })
      .catch((error) => {
        console.error('Error connecting to the database:', error);
      });
  }
}
