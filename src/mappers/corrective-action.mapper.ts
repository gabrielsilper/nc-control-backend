import ResponseCorrectiveActionDTO from 'dtos/response-corrective-action.dto';
import CorrectiveAction from 'entities/corrective-action';
import { userToEmbeddedDto } from './user.mapper';

export function correctiveActionToResponseDto(correctiveAction: CorrectiveAction): ResponseCorrectiveActionDTO {
  return {
    id: correctiveAction.id,
    description: correctiveAction.description,
    status: correctiveAction.status,
    deadline: correctiveAction.deadline,
    evidence: correctiveAction.evidence,
    nonConformityId: correctiveAction.nonConformityId,
    assignee: userToEmbeddedDto(correctiveAction.assignee!),
    finishedAt: correctiveAction.finishedAt,
    createdAt: correctiveAction.createdAt,
    updatedAt: correctiveAction.updatedAt,
  };
}
