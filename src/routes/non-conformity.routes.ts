import { Router } from 'express';
import { RequestWithPayload } from 'interfaces/token-service';
import { validateBody } from 'middlewares/validate-body.middleware';
import { ValidateTokenMiddleware } from 'middlewares/validate-token.middleware';
import { createNonConformitySchema } from 'schemas/create-non-conformity.schema';
import { updateNonConformitySchema } from 'schemas/update-non-conformity.schema';
import { TokenService } from 'services/token.service';
import NonConformityController from '../controllers/non-conformity.controller';
import NonConformityRepository from '../repositories/non-conformity.repository';
import UserRepository from '../repositories/user.repository';
import NonConformityService from '../services/non-conformity.service';
import UserService from '../services/user.service';
import Bcrypt from '../utils/bcrypt';

const encrypter = new Bcrypt();
const userRepository = new UserRepository();
const userService = new UserService(userRepository, encrypter);
const nonConformityRepository = new NonConformityRepository();
const nonConformityService = new NonConformityService(nonConformityRepository, userService);
const nonConformityController = new NonConformityController(nonConformityService);
const validateTokenMiddleware = new ValidateTokenMiddleware(new TokenService());

const nonConformityRoutes = Router();

nonConformityRoutes.post(
  '/',
  (req, res, next) => validateTokenMiddleware.handle(req as RequestWithPayload, res, next),
  validateBody(createNonConformitySchema),
  (req, res) => nonConformityController.create(req as RequestWithPayload, res),
);
nonConformityRoutes.get('/', (req, res) => nonConformityController.findAll(req as RequestWithPayload, res));
nonConformityRoutes.get('/:id', (req, res) => nonConformityController.findById(req, res));
nonConformityRoutes.put('/:id', validateBody(updateNonConformitySchema), (req, res) =>
  nonConformityController.update(req, res),
);
nonConformityRoutes.patch('/:id/status/:status', (req, res) => nonConformityController.updateStatus(req, res));
nonConformityRoutes.patch('/:id/assigne/:userId', (req, res) => nonConformityController.updateAssigne(req, res));
nonConformityRoutes.patch('/:id/due-date/:date', (req, res) => nonConformityController.updateDueDate(req, res));

export default nonConformityRoutes;
