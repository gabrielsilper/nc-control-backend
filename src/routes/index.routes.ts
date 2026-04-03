import { Router } from 'express';
import authRoutes from './auth.routes';
import nonConformityRoutes from './non-conformity.routes';
import userRoutes from './user.routes';

const indexRoutes = Router();

indexRoutes.use('/auth', authRoutes);
indexRoutes.use('/users', userRoutes);
indexRoutes.use('/non-conformities', nonConformityRoutes);

export default indexRoutes;
