import { Request, Response } from 'express';
import { RequestWithPayload } from 'interfaces/token-service';
import { nonConformityToResponseDto } from 'mappers/non-conformity.mapper';
import { CreateNonConformityDTO } from 'schemas/create-non-conformity.schema';
import { UpdateNonConformityDTO } from 'schemas/update-non-conformity.schema';
import NonConformityService from 'services/non-conformity.service';

export default class NonConformityController {
  constructor(private readonly nonConformityService: NonConformityService) {}

  async create(req: RequestWithPayload, res: Response) {
    const { sub } = req.payload;

    const nonConformityData = req.body as CreateNonConformityDTO;

    const newNonConformity = await this.nonConformityService.create(sub, nonConformityData);
    return res.status(201).json(nonConformityToResponseDto(newNonConformity));
  }

  async findAll(_req: RequestWithPayload, res: Response) {
    const nonConformities = await this.nonConformityService.findAll();
    const nonConformitiesDto = nonConformities.map((nonConformity) => nonConformityToResponseDto(nonConformity));
    return res.status(200).json(nonConformitiesDto);
  }

  async findById(req: Request, res: Response) {
    const { id } = req.params;

    const nonConformity = await this.nonConformityService.findById(id as string);
    return res.status(200).json(nonConformityToResponseDto(nonConformity));
  }

  async update(req: Request, res: Response) {
    const { id } = req.params;
    const updateData = req.body as UpdateNonConformityDTO;

    const nonConformity = await this.nonConformityService.update(id as string, updateData);
    return res.status(200).json(nonConformityToResponseDto(nonConformity));
  }

  async updateAssigne(req: Request, res: Response) {
    const { id, userId } = req.params;

    const nonConformity = await this.nonConformityService.updateAssigne(id as string, userId as string);
    return res.status(200).json(nonConformityToResponseDto(nonConformity));
  }

  async updateDueDate(req: Request, res: Response) {
    const { id, date } = req.params;
    const dueDate = new Date(date as string);

    const nonConformity = await this.nonConformityService.updateDueDate(id as string, dueDate);
    return res.status(200).json(nonConformityToResponseDto(nonConformity));
  }

  async finish(req: Request, res: Response) {
    const { id } = req.params;

    await this.nonConformityService.finish(id as string);
    return res.status(204).end();
  }
}
