import ResponseNonConformitiesPageDTO from 'dtos/response-non-conformities-page.dto';
import { Request, Response } from 'express';
import { nonConformityToResponseDto } from 'mappers/non-conformity.mapper';
import { CreateNonConformityDTO } from 'schemas/create-non-conformity.schema';
import { FindByIdParams } from 'schemas/find-by-id-params.schema';
import { FindNonConformitiesQuery } from 'schemas/find-non-conformities.schema';
import { AssignParams, UpdateDueDateParams, UpdateStatusParams } from 'schemas/non-conformity-params.schema';
import { UpdateNonConformityDTO } from 'schemas/update-non-conformity.schema';
import NonConformityService from 'services/non-conformity.service';

export default class NonConformityController {
  constructor(private readonly nonConformityService: NonConformityService) {}

  async create(req: Request, res: Response) {
    const { sub } = req.payload;

    const nonConformityData = req.body as CreateNonConformityDTO;

    const newNonConformity = await this.nonConformityService.create(sub, nonConformityData);
    return res.status(201).json(nonConformityToResponseDto(newNonConformity));
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
    const { id, userId } = req.validatedParams as AssignParams;

    const nonConformity = await this.nonConformityService.assign(id, userId);
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
}
