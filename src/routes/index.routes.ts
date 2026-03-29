import { Router } from 'express';
import authRoutes from './auth.routes';
import userRoutes from './user.routes';

const indexRoutes = Router();

indexRoutes.use(authRoutes);
indexRoutes.use('/users', userRoutes);

export default indexRoutes;
