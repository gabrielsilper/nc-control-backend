import { NcHistoryEventType } from 'enums/nc-history-event-type.enum';
import EmbeddedUserDTO from './embedded-user.dto';

export default interface ResponseNcHistoryDTO {
  id: string;
  eventType: NcHistoryEventType;
  actor: EmbeddedUserDTO;
  metadata: Record<string, unknown> | null;
  occurredAt: Date;
}
