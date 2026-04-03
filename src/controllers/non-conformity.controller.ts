import { Request, Response } from 'express';
import { RequestWithPayload } from 'interfaces/token-service';
import { nonConformityToResponseDto } from 'mappers/non-conformity.mapper';
import { CreateNonConformityDTO } from 'schemas/create-non-conformity.schema';
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
}
