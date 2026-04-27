import ResponseNonConformitiesPageDTO from 'dtos/response-non-conformities-page.dto';
import { Request, Response } from 'express';
import { correctiveActionToResponseDto } from 'mappers/corrective-action.mapper';
import { nonConformityToResponseDto } from 'mappers/non-conformity.mapper';
import { CreateCorrectiveActionParams } from 'schemas/corrective-action-params.schema';
import { CreateCorrectiveActionDTO } from 'schemas/create-corrective-action.schema';
import { CreateNonConformityDTO } from 'schemas/create-non-conformity.schema';
import { FindByIdParams } from 'schemas/find-by-id-params.schema';
import { FindNonConformitiesQuery, RankingLimitQuery } from 'schemas/non-conformities-queries.schema';
import { AssignBodyDTO, AssignParams, UpdateDueDateParams, UpdateStatusParams } from 'schemas/non-conformity-params.schema';
import { UpdateCorrectiveActionDTO, UpdateCorrectiveActionParams } from 'schemas/update-corrective-action.schema';
import { UpdateNonConformityDTO } from 'schemas/update-non-conformity.schema';
import CorrectiveActionService from 'services/corrective-action.service';
import NonConformityService from 'services/non-conformity.service';

export default class NonConformityController {
  constructor(
    private readonly nonConformityService: NonConformityService,
    private readonly correctiveActionService: CorrectiveActionService,
  ) {}

  async create(req: Request, res: Response) {
    const { sub } = req.payload;

    const nonConformityData = req.body as CreateNonConformityDTO;

    const newNonConformity = await this.nonConformityService.create(sub, nonConformityData);
    return res.status(201).json(nonConformityToResponseDto(newNonConformity));
  }

  async createCorrectiveAction(req: Request, res: Response) {
    const { ncId } = req.params as CreateCorrectiveActionParams;
    const correctiveActionData = req.body as CreateCorrectiveActionDTO;

    const newCorrectiveAction = await this.correctiveActionService.create(ncId, correctiveActionData);
    return res.status(201).json(correctiveActionToResponseDto(newCorrectiveAction));
  }

  async findAll(req: Request, res: Response) {
    const query = req.validatedQuery as FindNonConformitiesQuery;
    const pageResult = await this.nonConformityService.findAll(query);

    const response: ResponseNonConformitiesPageDTO = {
      ...pageResult,
      items: pageResult.items.map((nonConformity) => nonConformityToResponseDto(nonConformity)),
    };

    return res.status(200).json(response);
  }

  async findCorrectiveActionByNc(req: Request, res: Response) {
    const { ncId } = req.params as CreateCorrectiveActionParams;

    const correctiveAction = await this.correctiveActionService.findbyNc(ncId);

    return res.status(200).json(correctiveAction.map(correctiveActionToResponseDto));
  }

  async updateCorrectiveAction(req: Request, res: Response) {
    const { sub } = req.payload;
    const { caId } = req.params as UpdateCorrectiveActionParams;
    const dto = req.body as UpdateCorrectiveActionDTO;

    const updated = await this.correctiveActionService.update(caId, sub, dto);
    return res.status(200).json(correctiveActionToResponseDto(updated));
  }

  async findById(req: Request, res: Response) {
    const { id } = req.validatedParams as FindByIdParams;

    const nonConformity = await this.nonConformityService.findById(id);
    return res.status(200).json(nonConformityToResponseDto(nonConformity));
  }

  async update(req: Request, res: Response) {
    const { id } = req.validatedParams as FindByIdParams;
    const updateData = req.body as UpdateNonConformityDTO;

    const nonConformity = await this.nonConformityService.update(id, updateData);
    return res.status(200).json(nonConformityToResponseDto(nonConformity));
  }

  async assign(req: Request, res: Response) {
    const { id } = req.validatedParams as AssignParams;
    const { assignedToId, dueDate } = req.body as AssignBodyDTO;

    const nonConformity = await this.nonConformityService.assign(id, assignedToId, new Date(dueDate));
    return res.status(200).json(nonConformityToResponseDto(nonConformity));
  }

  async updateDueDate(req: Request, res: Response) {
    const { id, date } = req.validatedParams as UpdateDueDateParams;
    const dueDate = new Date(date);

    const nonConformity = await this.nonConformityService.updateDueDate(id, dueDate);
    return res.status(200).json(nonConformityToResponseDto(nonConformity));
  }

  async updateStatus(req: Request, res: Response) {
    const { id, status } = req.validatedParams as UpdateStatusParams;

    const nonConformity = await this.nonConformityService.updateStatus(id, status);
    return res.status(200).json(nonConformityToResponseDto(nonConformity));
  }

  async getDashboardCounts(_req: Request, res: Response) {
    const dashboardCounts = await this.nonConformityService.getDashboardCounts();
    return res.status(200).json(dashboardCounts);
  }

  async getDashboardTypeRanking(req: Request, res: Response) {
    const { limit } = req.validatedQuery as RankingLimitQuery;
    const dashboardCounts = await this.nonConformityService.getDashboardTypeRanking(limit);
    return res.status(200).json(dashboardCounts);
  }
}
