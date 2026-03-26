import { Router } from 'express';
import userRoutes from './user.routes';

const indexRoutes = Router();

indexRoutes.use('/users', userRoutes);

export default indexRoutes;
