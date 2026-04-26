import { Profile } from 'enums/profile.enum';
import { Router } from 'express';
import { validateBody } from 'middlewares/validate-body.middleware';
import { validateParams } from 'middlewares/validate-params.middleware';
import { validateProfileAuth } from 'middlewares/validate-profile-auth.middleware';
import { validateQuery } from 'middlewares/validate-query.middleware';
import { ValidateTokenMiddleware } from 'middlewares/validate-token.middleware';
import CorrectiveActionRepository from 'repositories/corrective-action.repository';
import NcYearSequenceRepository from 'repositories/nc-year-sequence.repository';
import { createCorrectiveActionParamsSchema } from 'schemas/corrective-action-params.schema';
import { createCorrectiveActionSchema } from 'schemas/create-corrective-action.schema';
import { createNonConformitySchema } from 'schemas/create-non-conformity.schema';
import { findByIdParamsSchema } from 'schemas/find-by-id-params.schema';
import { findNonConformitiesQuerySchema, rankingLimitQuerySchema } from 'schemas/non-conformities-queries.schema';
import { assignParamsSchema, updateDueDateParamsSchema, updateStatusParamsSchema } from 'schemas/non-conformity-params.schema';
import {
  updateCorrectiveActionParamsSchema,
  updateCorrectiveActionSchema,
} from 'schemas/update-corrective-action.schema';
import { updateNonConformitySchema } from 'schemas/update-non-conformity.schema';
import CorrectiveActionService from 'services/corrective-action.service';
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
const ncYearSequenceRepository = new NcYearSequenceRepository();
const correctiveActionRepository = new CorrectiveActionRepository();
const nonConformityService = new NonConformityService(nonConformityRepository, ncYearSequenceRepository, userService);
const correctiveActionService = new CorrectiveActionService(correctiveActionRepository, nonConformityService, userService);
const nonConformityController = new NonConformityController(nonConformityService, correctiveActionService);
const validateTokenMiddleware = new ValidateTokenMiddleware(new TokenService());

const nonConformityRoutes = Router();
nonConformityRoutes.use((req, res, next) => validateTokenMiddleware.handle(req, res, next));

nonConformityRoutes.post('/', validateBody(createNonConformitySchema), (req, res) => nonConformityController.create(req, res));

nonConformityRoutes.get('/', validateQuery(findNonConformitiesQuerySchema), (req, res) =>
  nonConformityController.findAll(req, res),
);

nonConformityRoutes.get('/counts', validateProfileAuth(Profile.GESTOR), (req, res) =>
  nonConformityController.getDashboardCounts(req, res),
);
nonConformityRoutes.get('/ranking', validateProfileAuth(Profile.GESTOR), validateQuery(rankingLimitQuerySchema), (req, res) =>
  nonConformityController.getDashboardTypeRanking(req, res),
);

nonConformityRoutes.get('/:id', validateParams(findByIdParamsSchema), (req, res) => nonConformityController.findById(req, res));

nonConformityRoutes.put(
  '/:id',
  validateProfileAuth(Profile.RESPONSAVEL),
  validateParams(findByIdParamsSchema),
  validateBody(updateNonConformitySchema),
  (req, res) => nonConformityController.update(req, res),
);

nonConformityRoutes.patch('/:id/status/:status', validateProfileAuth(Profile.RESPONSAVEL), validateParams(updateStatusParamsSchema), (req, res) =>
  nonConformityController.updateStatus(req, res),
);
nonConformityRoutes.patch('/:id/assign/:userId', validateProfileAuth(Profile.GESTOR), validateParams(assignParamsSchema), (req, res) =>
  nonConformityController.assign(req, res),
);
nonConformityRoutes.patch('/:id/due-date/:date', validateProfileAuth(Profile.GESTOR), validateParams(updateDueDateParamsSchema), (req, res) =>
  nonConformityController.updateDueDate(req, res),
);

nonConformityRoutes.post(
  '/:ncId/corrective-actions',
  validateProfileAuth(Profile.RESPONSAVEL),
  validateParams(createCorrectiveActionParamsSchema),
  validateBody(createCorrectiveActionSchema),
  (req, res) => nonConformityController.createCorrectiveAction(req, res),
);

nonConformityRoutes.get('/:ncId/corrective-actions', validateParams(createCorrectiveActionParamsSchema), (req, res) =>
  nonConformityController.findCorrectiveActionByNc(req, res),
);

nonConformityRoutes.patch(
  '/:ncId/corrective-actions/:caId',
  validateParams(updateCorrectiveActionParamsSchema),
  validateBody(updateCorrectiveActionSchema),
  (req, res) => nonConformityController.updateCorrectiveAction(req, res),
);

export default nonConformityRoutes;
