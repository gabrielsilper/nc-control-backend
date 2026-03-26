import { SeverityNc } from 'enums/severity_nc.enum';
import { StatusNc } from 'enums/status_nc.enum';
import { TypeNc } from 'enums/type_nc.enum';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import User from './users';

@Entity('non-conformities')
export default class NonConformity {
  @PrimaryGeneratedColumn('uuid')
  id!: number;

  @Column({ type: 'varchar', nullable: false })
  number!: string;

  @Column({ type: 'varchar', nullable: false })
  title!: string;

  @Column({ type: 'varchar', nullable: false })
  description!: string;

  @Column({ type: 'enum', nullable: false, enum: TypeNc })
  type!: TypeNc;

  @Column({ type: 'enum', nullable: false, enum: SeverityNc })
  severity!: SeverityNc;

  @Column({ type: 'enum', nullable: false, enum: StatusNc })
  status!: StatusNc;

  @Column({ type: 'text', nullable: false })
  process_line!: string;

  @Column({ type: 'text', nullable: false })
  department!: string;

  @Column({ type: 'text', nullable: true })
  rootCause!: string;

  @ManyToOne(
    () => User,
    (user) => user.createdNonConformities,
  )
  @JoinColumn({ name: 'created_by' })
  createdBy!: User;

  @ManyToOne(
    () => User,
    (user) => user.assignedNonConformities,
    {
      nullable: true,
    },
  )
  @JoinColumn({ name: 'assigned_to' })
  assignedTo!: User;

  @Column({ type: 'timestamptz', default: () => 'NOW()', name: 'opened_at' })
  openedAt!: Date;

  @Column({ type: 'timestamptz', nullable: true, name: 'due_date' })
  dueDate!: Date;

  @Column({ type: 'timestamptz', nullable: true, name: 'closed_at' })
  closedAt!: Date;
}
