import { SeverityNc } from 'enums/severity_nc.enum';
import { allowedTransitions, StatusNc } from 'enums/status_nc.enum';
import { TypeNc } from 'enums/type_nc.enum';
import { InvalidNonConformityStatusTransitionError } from 'errors/invalid-non-conformity-status-transition.error';
import { NonConformityMissingRootCauseError } from 'errors/nc-missing-root-cause.error';
import { NonConformityNotFoundError } from 'errors/non-conformity-not-found.error';
import NcYearSequenceRepository from 'repositories/nc-year-sequence.repository';
import NonConformityRepository from 'repositories/non-conformity.repository';
import { CreateNonConformityDTO } from 'schemas/create-non-conformity.schema';
import { FindNonConformitiesQuery } from 'schemas/non-conformities-queries.schema';
import { UpdateNonConformityDTO } from 'schemas/update-non-conformity.schema';
import UserService from './user.service';

export default class NonConformityService {
  constructor(
    private readonly nonConformityRepository: NonConformityRepository,
    private readonly ncYearSequenceRepository: NcYearSequenceRepository,
    private readonly userService: UserService,
  ) {}

  async create(userId: string, nonConformityData: CreateNonConformityDTO) {
    const user = await this.userService.findById(userId);
    const number = await this.generateNumber();

    const nonConformity = this.nonConformityRepository.create({
      ...nonConformityData,
      number,
      createdBy: user,
    });

    return this.nonConformityRepository.save(nonConformity);
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

  async update(id: string, nonConformityData: UpdateNonConformityDTO) {
    const nonConformity = await this.findById(id);
    const { status, ...restOfData } = nonConformityData;

    const UpdatedNonConformity = this.nonConformityRepository.merge(nonConformity, restOfData);
    const savedNonConformity = await this.nonConformityRepository.save(UpdatedNonConformity);

    if (status === undefined) {
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

    if (!allowedTransitions(currentStatus).includes(nextStatus)) {
      throw new InvalidNonConformityStatusTransitionError(currentStatus, nextStatus);
    }

    if (nextStatus === StatusNc.ENCERRADA && !nonConformity.rootCause) {
      throw new NonConformityMissingRootCauseError();
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
}
