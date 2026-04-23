import { Profile } from 'enums/profile.enum';
import { Router } from 'express';
import { validateBody } from 'middlewares/validate-body.middleware';
import { validateProfileAuth } from 'middlewares/validate-profile-auth.middleware';
import { validateSelfOrGestor } from 'middlewares/validate-self-or-gestor.middleware';
import { ValidateTokenMiddleware } from 'middlewares/validate-token.middleware';
import { createUserSchema } from 'schemas/create-user.schema';
import { updateUserSchema } from 'schemas/update-user.schema';
import { TokenService } from 'services/token.service';
import UserController from '../controllers/user.controller';
import UserRepository from '../repositories/user.repository';
import UserService from '../services/user.service';
import Bcrypt from '../utils/bcrypt';

const encrypter = new Bcrypt();
const userRepository = new UserRepository();
const userService = new UserService(userRepository, encrypter);
const userController = new UserController(userService);
const validateTokenMiddleware = new ValidateTokenMiddleware(new TokenService());

const userRoutes = Router();

userRoutes.post(
  '/',
  (req, res, next) => validateTokenMiddleware.handle(req, res, next),
  validateProfileAuth(Profile.GESTOR),
  validateBody(createUserSchema),
  (req, res) => userController.create(req, res),
);

userRoutes.get(
  '/:id',
  (req, res, next) => validateTokenMiddleware.handle(req, res, next),
  validateSelfOrGestor,
  (req, res) => userController.getById(req, res),
);
userRoutes.put(
  '/:id',
  (req, res, next) => validateTokenMiddleware.handle(req, res, next),
  validateSelfOrGestor,
  validateBody(updateUserSchema),
  (req, res) => userController.update(req, res),
);

userRoutes.get(
  '/',
  (req, res, next) => validateTokenMiddleware.handle(req, res, next),
  validateProfileAuth(Profile.GESTOR),
  (req, res) => userController.getAll(req, res),
);
userRoutes.delete(
  '/:id',
  (req, res, next) => validateTokenMiddleware.handle(req, res, next),
  validateProfileAuth(Profile.GESTOR),
  (req, res) => userController.delete(req, res),
);

export default userRoutes;
