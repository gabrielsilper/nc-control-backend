import { StatusNc } from 'enums/status_nc.enum';
import { NonConformityNumberAlreadyExistsError } from 'errors/nc-number-already-exists.error copy';
import { NonConformityNotFoundError } from 'errors/non-conformity-not-found.error';
import NonConformityRepository from 'repositories/non-conformity.repository';
import { CreateNonConformityDTO } from 'schemas/create-non-conformity.schema';
import { UpdateNonConformityDTO } from 'schemas/update-non-conformity.schema';
import UserService from './user.service';

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

  async update(id: string, nonConformityData: UpdateNonConformityDTO) {
    const nonConformity = await this.findById(id);

    const UpdatedNonConformity = this.nonConformityRepository.merge(nonConformity, nonConformityData);

    return this.nonConformityRepository.save(UpdatedNonConformity);
  }

  async updateStatus(id: string, status: StatusNc) {
    const nonConformity = await this.findById(id);

    nonConformity.status = status;

    return this.nonConformityRepository.save(nonConformity);
  }

  async updateAssigne(id: string, userId: string) {
    const nonConformity = await this.findById(id);

    nonConformity.assignedToId = userId;

    return this.nonConformityRepository.save(nonConformity);
  }

  async updateDueDate(id: string, dueDate: Date) {
    const nonConformity = await this.findById(id);

    nonConformity.dueDate = dueDate;

    return this.nonConformityRepository.save(nonConformity);
  }

  async finish(id: string) {
    await this.findById(id);

    await this.nonConformityRepository.update({ id }, { status: StatusNc.ENCERRADA, closedAt: () => 'CURRENT_TIMESTAMP' });
  }
}
