import { Router } from 'express';
import { RequestWithPayload } from 'interfaces/token-service';
import { validateBody } from 'middlewares/validate-body.middleware';
import { ValidateTokenMiddleware } from 'middlewares/validate-token.middleware';
import { createNonConformitySchema } from 'schemas/create-non-conformity.schema';
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
nonConformityRoutes.get('/', (req, res) => res.end(req.url));
nonConformityRoutes.get('/:id', (req, res) => res.end(req.url));
nonConformityRoutes.put('/', (req, res) => res.end(req.url));
nonConformityRoutes.delete('/', (req, res) => res.end(req.url));

// Essa vai ser para atualizar o responsável
nonConformityRoutes.patch('/:id/assigne/:user', (req, res) => res.end(req.url));

// Essa vai ser para atualizar a data de expiração
nonConformityRoutes.patch('/:id/due-date/:date', (req, res) => res.end(req.url));

// Essa vai ser para finalizar a não conformidade
nonConformityRoutes.patch('/:id/fisish', (req, res) => res.end(req.url));

// Falta imaginar para atualizar os status

export default nonConformityRoutes;
