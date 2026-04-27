import ResponseNonConformityDTO from 'dtos/response-non-conformity.dto';
import NonConformity from 'entities/non-conformity';
import { userToEmbeddedDto } from './user.mapper';

export function nonConformityToResponseDto(nonConformity: NonConformity): ResponseNonConformityDTO {
  return {
    id: nonConformity.id,
    number: nonConformity.number,
    title: nonConformity.title,
    description: nonConformity.description,
    type: nonConformity.type,
    severity: nonConformity.severity,
    status: nonConformity.status,
    processLine: nonConformity.processLine,
    department: nonConformity.department,
    rootCause: nonConformity.rootCause,
    createdBy: userToEmbeddedDto(nonConformity.createdBy),
    assignedTo: nonConformity.assignedTo ? userToEmbeddedDto(nonConformity.assignedTo) : null,
    openedAt: nonConformity.openedAt,
    dueDate: nonConformity.dueDate,
    closedAt: nonConformity.closedAt,
  };
}
