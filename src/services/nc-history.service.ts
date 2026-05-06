import User from 'entities/user';
import { NcHistoryEventType } from 'enums/nc-history-event-type.enum';
import { StatusNc } from 'enums/status_nc.enum';
import NcHistoryRepository from 'repositories/nc-history.repository';

export default class NcHistoryService {
  constructor(private readonly ncHistoryRepository: NcHistoryRepository) {}

  async recordCreated(ncId: string, actorId: string, metadata: { number: string; title: string }) {
    const history = this.ncHistoryRepository.create({
      ncId,
      actorId,
      eventType: NcHistoryEventType.CREATED,
      metadata,
    });
    return this.ncHistoryRepository.save(history);
  }

  async recordStatusChanged(ncId: string, actorId: string, previousStatus: StatusNc, newStatus: StatusNc) {
    const history = this.ncHistoryRepository.create({
      ncId,
      actorId,
      eventType: NcHistoryEventType.STATUS_CHANGED,
      metadata: { previousStatus, newStatus },
    });
    return this.ncHistoryRepository.save(history);
  }

  async recordAssigned(ncId: string, actorId: string, previousAssignee: User | null, newAssignee: User, dueDate: Date) {
    const isReplacement = previousAssignee !== null;
    const history = this.ncHistoryRepository.create({
      ncId,
      actorId,
      eventType: isReplacement ? NcHistoryEventType.ASSIGNEE_CHANGED : NcHistoryEventType.ASSIGNEE_SET,
      metadata: isReplacement
        ? {
            previousAssigneeId: previousAssignee?.id,
            previousAssigneeName: previousAssignee?.name,
            newAssigneeId: newAssignee.id,
            newAssigneeName: newAssignee.name,
            dueDate,
          }
        : {
            assigneeId: newAssignee.id,
            assigneeName: newAssignee.name,
            dueDate,
          },
    });
    return this.ncHistoryRepository.save(history);
  }

  async recordDueDateUpdated(ncId: string, actorId: string, previousDueDate: Date | undefined, newDueDate: Date) {
    const history = this.ncHistoryRepository.create({
      ncId,
      actorId,
      eventType: NcHistoryEventType.DUE_DATE_UPDATED,
      metadata: { previousDueDate: previousDueDate ?? null, newDueDate },
    });
    return this.ncHistoryRepository.save(history);
  }

  async recordFieldsUpdated(ncId: string, actorId: string, fields: string[]) {
    const history = this.ncHistoryRepository.create({
      ncId,
      actorId,
      eventType: NcHistoryEventType.FIELDS_UPDATED,
      metadata: { fields },
    });
    return this.ncHistoryRepository.save(history);
  }

  async findByNcId(ncId: string) {
    return this.ncHistoryRepository.find({
      where: { ncId },
      relations: ['actor'],
      order: { occurredAt: 'ASC' },
    });
  }
}
