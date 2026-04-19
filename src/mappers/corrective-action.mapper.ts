import ResponseCorrectiveActionDTO from 'dtos/response-corrective-action.dto';
import CorrectiveAction from 'entities/corrective-action';

export function correctiveActionToResponseDto(correctiveAction: CorrectiveAction): ResponseCorrectiveActionDTO {
  return {
    id: correctiveAction.id,
    description: correctiveAction.description,
    status: correctiveAction.status,
    deadline: correctiveAction.deadline,
    evidence: correctiveAction.evidence,
    nonConformityId: correctiveAction.nonConformityId,
    assigneeId: correctiveAction.assigneeId,
    finishedAt: correctiveAction.finishedAt,
    createdAt: correctiveAction.createdAt,
    updatedAt: correctiveAction.updatedAt,
  };
}
