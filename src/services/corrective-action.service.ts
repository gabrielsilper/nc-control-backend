import { Profile } from 'enums/profile.enum';
import { StatusCa } from 'enums/status.enum';
import { CorrectiveActionForbiddenError } from 'errors/corrective-action-forbidden.error';
import { CorrectiveActionMissingEvidenceError } from 'errors/corrective-action-missing-evidence.error';
import { CorrectiveActionNotFoundError } from 'errors/corrective-action-not-found.error';
import { NcMissingAssigneeError } from 'errors/nc-missing-assignee.error';
import CorrectiveActionRepository from 'repositories/corrective-action.repository';
import { CreateCorrectiveActionDTO } from 'schemas/create-corrective-action.schema';
import { UpdateCorrectiveActionDTO } from 'schemas/update-corrective-action.schema';
import NonConformityService from './non-conformity.service';
import UserService from './user.service';

export default class CorrectiveActionService {
  constructor(
    private correctiveActionRepository: CorrectiveActionRepository,
    private nonConformityService: NonConformityService,
    private userService: UserService,
  ) {}

  async findbyNc(nonConformityId: string) {
    await this.nonConformityService.findById(nonConformityId);

    return this.correctiveActionRepository.find({
      where: { nonConformityId },
      relations: ['assignee'],
      order: { createdAt: 'ASC' },
    });
  }

  async create(
    nonConformityId: string,
    userId: string,
    profile: Profile,
    correctiveActionData: CreateCorrectiveActionDTO,
  ) {
    const nonConformity = await this.nonConformityService.findById(nonConformityId);

    if (!nonConformity.assignedToId) {
      throw new NcMissingAssigneeError();
    }

    this.ensureCanManageActionPlan(nonConformity.assignedToId, userId, profile);

    const assignee = await this.userService.findById(nonConformity.assignedToId);

    const correctiveAction = this.correctiveActionRepository.create({
      ...correctiveActionData,
      nonConformity,
      assignee,
    });

    return this.correctiveActionRepository.save(correctiveAction);
  }

  async update(caId: string, userId: string, profile: Profile, dto: UpdateCorrectiveActionDTO) {
    const action = await this.correctiveActionRepository.findOne({
      where: { id: caId },
      relations: ['assignee', 'nonConformity'],
    });

    if (!action) {
      throw new CorrectiveActionNotFoundError();
    }

    this.ensureCanManageActionPlan(action.nonConformity.assignedToId, userId, profile);

    const nextStatus = dto.status ?? action.status;
    const nextEvidence = dto.evidence ?? action.evidence;

    if (nextStatus === StatusCa.CONCLUIDA && !nextEvidence) {
      throw new CorrectiveActionMissingEvidenceError();
    }

    const wasDone = action.status === StatusCa.CONCLUIDA;
    const willBeDone = nextStatus === StatusCa.CONCLUIDA;

    action.status = nextStatus;
    if (dto.evidence !== undefined) {
      action.evidence = dto.evidence;
    }

    if (!wasDone && willBeDone) {
      action.finishedAt = new Date();
    } else if (wasDone && !willBeDone) {
      action.finishedAt = undefined;
    }

    return this.correctiveActionRepository.save(action);
  }

  private ensureCanManageActionPlan(
    ncAssignedToId: string | null | undefined,
    userId: string,
    profile: Profile,
  ) {
    if (profile === Profile.GESTOR) {
      return;
    }

    if (ncAssignedToId && ncAssignedToId === userId) {
      return;
    }

    throw new CorrectiveActionForbiddenError();
  }
}
