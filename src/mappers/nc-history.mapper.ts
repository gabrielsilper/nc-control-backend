import ResponseNcHistoryDTO from 'dtos/response-nc-history.dto';
import NcHistory from 'entities/nc-history';
import { userToEmbeddedDto } from './user.mapper';

export function ncHistoryToResponseDto(history: NcHistory): ResponseNcHistoryDTO {
  return {
    id: history.id,
    eventType: history.eventType,
    actor: userToEmbeddedDto(history.actor),
    metadata: history.metadata ?? null,
    occurredAt: history.occurredAt,
  };
}
