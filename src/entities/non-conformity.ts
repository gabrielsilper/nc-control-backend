import { SeverityNc } from 'enums/severity_nc.enum';
import { StatusNc } from 'enums/status_nc.enum';
import { TypeNc } from 'enums/type_nc.enum';
import { Column, Entity, Index, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import User from './user';

@Entity('non-conformities')
export default class NonConformity {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ type: 'varchar', nullable: false, unique: true })
  number!: string;

  @Column({ type: 'varchar', nullable: false })
  title!: string;

  @Column({ type: 'varchar', nullable: false })
  description!: string;

  @Column({ type: 'enum', nullable: false, enum: TypeNc })
  type!: TypeNc;

  @Column({ type: 'enum', nullable: false, enum: SeverityNc })
  severity!: SeverityNc;

  @Column({ type: 'enum', nullable: false, enum: StatusNc, default: StatusNc.ABERTA })
  status!: StatusNc;

  @Column({ type: 'text', nullable: false, name: 'process_line' })
  processLine!: string;

  @Column({ type: 'text', nullable: false })
  department!: string;

  @Column({ type: 'text', nullable: true, name: 'root_cause' })
  rootCause?: string;

  @Index()
  @Column({ type: 'uuid', name: 'created_by' })
  createdById!: string;

  @ManyToOne(
    () => User,
    (user) => user.createdNonConformities,
  )
  @JoinColumn({ name: 'created_by' })
  createdBy!: User;

  @Index()
  @Column({ type: 'uuid', nullable: true, name: 'assigned_to' })
  assignedToId?: string;

  @ManyToOne(
    () => User,
    (user) => user.assignedNonConformities,
    {
      nullable: true,
    },
  )
  @JoinColumn({ name: 'assigned_to' })
  assignedTo?: User | null;

  @Column({ type: 'timestamptz', default: () => 'NOW()', name: 'opened_at' })
  openedAt!: Date;

  @Column({ type: 'timestamptz', nullable: true, name: 'due_date' })
  dueDate?: Date;

  @Column({ type: 'timestamptz', nullable: true, name: 'closed_at' })
  closedAt?: Date;
}
