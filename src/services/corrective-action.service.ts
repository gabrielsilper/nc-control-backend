import CorrectiveActionRepository from 'repositories/corrective-action.repository';
import { CreateCorrectiveActionDTO } from 'schemas/create-corrective-action.schema';
import NonConformityService from './non-conformity.service';
import UserService from './user.service';

export default class CorrectiveActionService {
  constructor(
    private correctiveActionRepository: CorrectiveActionRepository,
    private nonConformityService: NonConformityService,
    private userService: UserService,
  ) {}

  async findbyNc(nonConformityId: string) {
    const nonConformity = await this.nonConformityService.findById(nonConformityId);

    return this.correctiveActionRepository.findBy({ nonConformity });
  }

  async create(nonConformityId: string, correctiveActionData: CreateCorrectiveActionDTO) {
    const nonConformity = await this.nonConformityService.findById(nonConformityId);
    const assignee = await this.userService.findById(correctiveActionData.assigneeId);

    const correctiveAction = this.correctiveActionRepository.create({
      ...correctiveActionData,
      nonConformity,
      assignee,
    });

    return this.correctiveActionRepository.save(correctiveAction);
  }
}
