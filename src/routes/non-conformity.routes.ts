import { Router } from 'express';
import { validateBody } from 'middlewares/validate-body.middleware';
import { validateParams } from 'middlewares/validate-params.middleware';
import { validateQuery } from 'middlewares/validate-query.middleware';
import { ValidateTokenMiddleware } from 'middlewares/validate-token.middleware';
import { createNonConformitySchema } from 'schemas/create-non-conformity.schema';
import { findByIdParamsSchema } from 'schemas/find-by-id-params.schema';
import { findNonConformitiesQuerySchema, rankingLimitQuerySchema } from 'schemas/non-conformities-queries.schema';
import { assignParamsSchema, updateDueDateParamsSchema, updateStatusParamsSchema } from 'schemas/non-conformity-params.schema';
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
nonConformityRoutes.use((req, res, next) => validateTokenMiddleware.handle(req, res, next));

nonConformityRoutes.post('/', validateBody(createNonConformitySchema), (req, res) => nonConformityController.create(req, res));

nonConformityRoutes.get('/', validateQuery(findNonConformitiesQuerySchema), (req, res) =>
  nonConformityController.findAll(req, res),
);

nonConformityRoutes.get('/counts', (req, res) => nonConformityController.getDashboardCounts(req, res));
nonConformityRoutes.get('/ranking', validateQuery(rankingLimitQuerySchema), (req, res) =>
  nonConformityController.getDashboardTypeRanking(req, res),
);

nonConformityRoutes.get('/:id', validateParams(findByIdParamsSchema), (req, res) => nonConformityController.findById(req, res));

nonConformityRoutes.put('/:id', validateParams(findByIdParamsSchema), validateBody(updateNonConformitySchema), (req, res) =>
  nonConformityController.update(req, res),
);

nonConformityRoutes.patch('/:id/status/:status', validateParams(updateStatusParamsSchema), (req, res) =>
  nonConformityController.updateStatus(req, res),
);
nonConformityRoutes.patch('/:id/assign/:userId', validateParams(assignParamsSchema), (req, res) =>
  nonConformityController.assign(req, res),
);
nonConformityRoutes.patch('/:id/due-date/:date', validateParams(updateDueDateParamsSchema), (req, res) =>
  nonConformityController.updateDueDate(req, res),
);

export default nonConformityRoutes;
