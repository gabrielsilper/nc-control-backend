import { Response } from 'express';
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
}
