import { Router } from 'express';
import { validateBody } from 'middlewares/validate-body';
import { createUserSchema } from 'schemas/create-user.schema';
import { updateUserSchema } from 'schemas/update-user.schema';
import UserController from '../controllers/user.controller';
import UserRepository from '../repositories/user.repository';
import UserService from '../services/user.service';
import Bcrypt from '../utils/bcrypt';

const encrypter = new Bcrypt();
const userRepository = new UserRepository();
const userService = new UserService(userRepository, encrypter);
const userController = new UserController(userService);

const userRoutes = Router();
userRoutes.get('/', (req, res) => userController.getAll(req, res));
userRoutes.get('/:id', (req, res) => userController.getById(req, res));
userRoutes.post('/', validateBody(createUserSchema), (req, res) => userController.create(req, res));
userRoutes.put('/:id', validateBody(updateUserSchema), (req, res) => userController.update(req, res));
userRoutes.delete('/:id', (req, res) => userController.delete(req, res));

export default userRoutes;
