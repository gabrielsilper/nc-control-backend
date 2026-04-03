import NonConformityRepository from 'repositories/non-conformity.repository';
import { CreateNonConformityDTO } from 'schemas/create-non-conformity.schema';
import UserService from './user.service';

export default class NonConformityService {
  constructor(
    private readonly nonConformityRepository: NonConformityRepository,
    private readonly userService: UserService,
  ) {}

  async create(userId: string, nonConformityData: CreateNonConformityDTO) {
    const user = await this.userService.findById(userId);

    const nonConformity = this.nonConformityRepository.create({
      ...nonConformityData,
      createdBy: user,
    });

    this.nonConformityRepository.save(nonConformity);
  }
}
