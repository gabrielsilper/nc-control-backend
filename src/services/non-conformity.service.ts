import NonConformityRepository from 'repositories/non-conformity.repository';
import { CreateNonConformityDTO } from 'schemas/create-non-conformity.schema';
import UserService from './user.service';
import { NonConformityNumberAlreadyExistsError } from 'errors/nc-number-already-exists.error copy';
import { NonConformityNotFoundError } from 'errors/non-conformity-not-found.error';

export default class NonConformityService {
  constructor(
    private readonly nonConformityRepository: NonConformityRepository,
    private readonly userService: UserService,
  ) {}

  async create(userId: string, nonConformityData: CreateNonConformityDTO) {
    const user = await this.userService.findById(userId);

    const ncExists = await this.nonConformityRepository.existsBy({
      number: nonConformityData.number,
    });

    if (ncExists) {
      throw new NonConformityNumberAlreadyExistsError();
    }

    const nonConformity = this.nonConformityRepository.create({
      ...nonConformityData,
      createdBy: user,
    });

    return this.nonConformityRepository.save(nonConformity);
  }

  findAll() {
    return this.nonConformityRepository.find();
  }

  async findById(id: string) {
    const nonConformity = await this.nonConformityRepository.findOneBy({ id });

    if (!nonConformity) {
      throw new NonConformityNotFoundError();
    }

    return nonConformity;
  }
}
