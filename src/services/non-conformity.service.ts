import { SeverityNc } from 'enums/severity_nc.enum';
import { allowedTransitions, StatusNc } from 'enums/status_nc.enum';
import { TypeNc } from 'enums/type_nc.enum';
import { InvalidNonConformityStatusTransitionError } from 'errors/invalid-non-conformity-status-transition.error';
import { NonConformityMissingRootCauseError } from 'errors/nc-missing-root-cause.error';
import { NonConformityMissingAssignmentRequirementsError } from 'errors/non-conformity-missing-assignment-requirements.error';
import { NonConformityNotFoundError } from 'errors/non-conformity-not-found.error';
import NcYearSequenceRepository from 'repositories/nc-year-sequence.repository';
import NonConformityRepository from 'repositories/non-conformity.repository';
import { CreateNonConformityDTO } from 'schemas/create-non-conformity.schema';
import { FindNonConformitiesQuery } from 'schemas/non-conformities-queries.schema';
import { UpdateNonConformityDTO } from 'schemas/update-non-conformity.schema';
import NcHistoryService from './nc-history.service';
import UserService from './user.service';

export default class NonConformityService {
  constructor(
    private readonly nonConformityRepository: NonConformityRepository,
    private readonly ncYearSequenceRepository: NcYearSequenceRepository,
    private readonly userService: UserService,
    private readonly ncHistoryService: NcHistoryService,
  ) {}

  async create(userId: string, nonConformityData: CreateNonConformityDTO) {
    const user = await this.userService.findById(userId);
    const number = await this.generateNumber();

    const nonConformity = this.nonConformityRepository.create({
      ...nonConformityData,
      number,
      createdBy: user,
    });

    const saved = await this.nonConformityRepository.save(nonConformity);
    await this.ncHistoryService.recordCreated(saved.id, userId, { number: saved.number, title: saved.title });
    return saved;
  }

  async findAll(filters: FindNonConformitiesQuery) {
    const { page, pageSize, order, type, severity, status, assignedToId, expired, search } = filters;
    const queryBuilder = this.nonConformityRepository
      .createQueryBuilder('nonConformity')
      .leftJoinAndSelect('nonConformity.createdBy', 'createdBy')
      .leftJoinAndSelect('nonConformity.assignedTo', 'assignedTo');

    if (type !== undefined) {
      queryBuilder.andWhere('nonConformity.type = :type', { type });
    }

    if (severity !== undefined) {
      queryBuilder.andWhere('nonConformity.severity = :severity', { severity });
    }

    if (status !== undefined) {
      queryBuilder.andWhere('nonConformity.status = :status', { status });
    }

    if (assignedToId) {
      queryBuilder.andWhere('nonConformity.assignedToId = :assignedToId', {
        assignedToId,
      });
    }

    if (expired !== undefined) {
      if (expired) {
        queryBuilder.andWhere('nonConformity.dueDate IS NOT NULL AND nonConformity.dueDate < NOW()');
        queryBuilder.andWhere('nonConformity.status not in (:...status)', { status: [StatusNc.CANCELADA, StatusNc.ENCERRADA] });
      } else {
        queryBuilder.andWhere('(nonConformity.dueDate IS NULL OR nonConformity.dueDate >= NOW())');
      }
    }

    if (search) {
      queryBuilder.andWhere('(nonConformity.number ILIKE :search OR nonConformity.title ILIKE :search)', {
        search: `%${search}%`,
      });
    }

    queryBuilder.orderBy('nonConformity.openedAt', order);

    const [items, total] = await queryBuilder
      .skip((page - 1) * pageSize)
      .take(pageSize)
      .getManyAndCount();
    const totalPages = Math.ceil(total / pageSize);
    const hasNext = page < totalPages;

    return {
      items,
      total,
      page,
      pageSize,
      totalPages,
      hasNext,
    };
  }

  async findMyQueue(userId: string) {
    return this.nonConformityRepository
      .createQueryBuilder('nonConformity')
      .leftJoinAndSelect('nonConformity.createdBy', 'createdBy')
      .leftJoinAndSelect('nonConformity.assignedTo', 'assignedTo')
      .where('nonConformity.assignedToId = :userId', { userId })
      .andWhere('nonConformity.status NOT IN (:...closedStatus)', {
        closedStatus: [StatusNc.ENCERRADA, StatusNc.CANCELADA],
      })
      .orderBy(
        `CASE
          WHEN nonConformity.dueDate IS NOT NULL AND nonConformity.dueDate < NOW() THEN 0
          WHEN nonConformity.dueDate IS NULL THEN 2
          ELSE 1
        END`,
        'ASC',
      )
      .addOrderBy('nonConformity.dueDate', 'ASC', 'NULLS LAST')
      .getMany();
  }

  async findById(id: string) {
    const nonConformity = await this.nonConformityRepository.findOne({
      where: { id },
      relations: ['createdBy', 'assignedTo'],
    });

    if (!nonConformity) {
      throw new NonConformityNotFoundError();
    }

    return nonConformity;
  }

  async update(id: string, userId: string, nonConformityData: UpdateNonConformityDTO) {
    const nonConformity = await this.findById(id);
    const { status, ...restOfData } = nonConformityData;

    const changedFields = Object.keys(restOfData).filter((k) => restOfData[k as keyof typeof restOfData] !== undefined);
    const updatedNonConformity = this.nonConformityRepository.merge(nonConformity, restOfData);
    const savedNonConformity = await this.nonConformityRepository.save(updatedNonConformity);

    if (changedFields.length > 0) {
      await this.ncHistoryService.recordFieldsUpdated(id, userId, changedFields);
    }

    if (status === undefined) {
      return savedNonConformity;
    }

    return this.updateStatus(id, userId, status);
  }

  async updateStatus(id: string, userId: string, nextStatus: StatusNc) {
    const nonConformity = await this.findById(id);
    const currentStatus = nonConformity.status;

    if (currentStatus === nextStatus) {
      return nonConformity;
    }

    if (!allowedTransitions(currentStatus).includes(nextStatus)) {
      throw new InvalidNonConformityStatusTransitionError(currentStatus, nextStatus);
    }

    if (nextStatus === StatusNc.ENCERRADA && !nonConformity.rootCause) {
      throw new NonConformityMissingRootCauseError();
    }

    if (nextStatus === StatusNc.EM_TRATAMENTO) {
      this.ensureAssignmentRequirements(nonConformity.assignedToId, nonConformity.dueDate);
    }

    nonConformity.closedAt = nextStatus === StatusNc.ENCERRADA ? new Date() : null;
    nonConformity.status = nextStatus;

    const saved = await this.nonConformityRepository.save(nonConformity);
    await this.ncHistoryService.recordStatusChanged(id, userId, currentStatus, nextStatus);
    return saved;
  }

  async assign(id: string, userId: string, assignedToId: string, dueDate: Date) {
    const nonConformity = await this.findById(id);
    this.ensureAssignmentRequirements(assignedToId, dueDate);

    const previousAssignee = nonConformity.assignedTo ?? null;
    const newAssignee = await this.userService.findById(assignedToId);
    const previousStatus = nonConformity.status;

    nonConformity.assignedTo = newAssignee;
    nonConformity.dueDate = dueDate;

    if (nonConformity.status === StatusNc.ABERTA) {
      nonConformity.status = StatusNc.EM_TRATAMENTO;
    }

    const saved = await this.nonConformityRepository.save(nonConformity);

    await this.ncHistoryService.recordAssigned(id, userId, previousAssignee, newAssignee, dueDate);

    if (previousStatus === StatusNc.ABERTA) {
      await this.ncHistoryService.recordStatusChanged(id, userId, StatusNc.ABERTA, StatusNc.EM_TRATAMENTO);
    }

    return saved;
  }

  async updateDueDate(id: string, userId: string, dueDate: Date) {
    const nonConformity = await this.findById(id);
    const previousDueDate = nonConformity.dueDate;

    nonConformity.dueDate = dueDate;

    const saved = await this.nonConformityRepository.save(nonConformity);
    await this.ncHistoryService.recordDueDateUpdated(id, userId, previousDueDate, dueDate);
    return saved;
  }

  async getHistory(ncId: string) {
    await this.findById(ncId);
    return this.ncHistoryService.findByNcId(ncId);
  }

  async getDashboardCounts() {
    const raw = await this.nonConformityRepository
      .createQueryBuilder('nc')
      .select('COUNT(CASE WHEN nc.status = :openStatus THEN 1 END)', 'openNonConformities')
      .addSelect(
        'COUNT(CASE WHEN nc.severity IN (:...severities) AND nc.status NOT IN (:...closedStatus) THEN 1 END)',
        'warningNonConformities',
      )
      .addSelect(
        'COUNT(CASE WHEN nc.dueDate < CURRENT_DATE AND nc.status NOT IN (:...closedStatus) THEN 1 END)',
        'expiredNonConformities',
      )
      .addSelect('COUNT(CASE WHEN EXTRACT(MONTH FROM nc.closedAt) = :month THEN 1 END)', 'closedNonConformities')
      .setParameters({
        openStatus: StatusNc.ABERTA,
        closedStatus: [StatusNc.ENCERRADA, StatusNc.CANCELADA],
        severities: [SeverityNc.ALTA, SeverityNc.CRITICA],
        month: this.getCurrentMonth(),
      })
      .getRawOne();

    return {
      openNonConformities: Number(raw.openNonConformities),
      warningNonConformities: Number(raw.warningNonConformities),
      expiredNonConformities: Number(raw.expiredNonConformities),
      closedNonConformities: Number(raw.closedNonConformities),
    };
  }

  async getDashboardTypeRanking(limit: number) {
    const raw = await this.nonConformityRepository
      .createQueryBuilder('nc')
      .select('nc.type', 'type')
      .addSelect('COUNT(*)', 'total')
      .groupBy('nc.type')
      .orderBy('total', 'DESC')
      .limit(limit)
      .getRawMany();

    return raw.map((row) => ({
      type: row.type,
      name: TypeNc[row.type],
      total: Number(row.total),
    }));
  }

  private async generateNumber(): Promise<string> {
    const year = new Date().getFullYear();
    const seq = await this.ncYearSequenceRepository.nextSequence(year);
    return `NC-${year}-${String(seq).padStart(4, '0')}`;
  }

  private getCurrentMonth() {
    return new Date().getMonth() + 1;
  }

  private ensureAssignmentRequirements(assignedToId?: string | null, dueDate?: Date | null) {
    if (!assignedToId || !dueDate) {
      throw new NonConformityMissingAssignmentRequirementsError();
    }
  }
}
