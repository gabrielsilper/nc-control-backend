import { StatusNc } from 'enums/status_nc.enum';
import { InvalidNonConformityStatusTransitionError } from 'errors/invalid-non-conformity-status-transition.error';
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
    const { status, ...restOfData } = nonConformityData;

    const UpdatedNonConformity = this.nonConformityRepository.merge(nonConformity, restOfData);
    const savedNonConformity = await this.nonConformityRepository.save(UpdatedNonConformity);

    if (!status) {
      return savedNonConformity;
    }

    return this.updateStatus(id, status);
  }

  async updateStatus(id: string, nextStatus: StatusNc) {
    const nonConformity = await this.findById(id);
    const currentStatus = nonConformity.status;

    if (currentStatus === nextStatus) {
      return nonConformity;
    }

    if (currentStatus === StatusNc.CANCELADA) {
      throw new InvalidNonConformityStatusTransitionError(currentStatus, nextStatus);
    }

    if (currentStatus === StatusNc.ENCERRADA && nextStatus !== StatusNc.ABERTA) {
      throw new InvalidNonConformityStatusTransitionError(currentStatus, nextStatus);
    }

    nonConformity.closedAt = nextStatus === StatusNc.ENCERRADA ? new Date() : null;
    nonConformity.status = nextStatus;

    return this.nonConformityRepository.save(nonConformity);
  }

  async assign(id: string, userId: string) {
    const nonConformity = await this.findById(id);
    const user = await this.userService.findById(userId);

    nonConformity.assignedTo = user;

    return this.nonConformityRepository.save(nonConformity);
  }

  async updateDueDate(id: string, dueDate: Date) {
    const nonConformity = await this.findById(id);

    nonConformity.dueDate = dueDate;

    return this.nonConformityRepository.save(nonConformity);
  }
}
