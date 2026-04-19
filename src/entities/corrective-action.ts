import { StatusCa } from 'enums/status.enum';
import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import NonConformity from './non-conformity';
import User from './user';

@Entity('corrective_actions')
export default class CorrectiveAction {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ type: 'text', nullable: false })
  description!: string;

  @Column({
    type: 'enum',
    enum: StatusCa,
    default: StatusCa.PENDENTE,
    nullable: false,
  })
  status!: StatusCa;

  @Column({ type: 'timestamptz', nullable: false })
  deadline!: Date;

  @Column({ type: 'text', nullable: true })
  evidence?: string;

  @Index()
  @Column({ type: 'uuid', name: 'nc_id' })
  nonConformityId!: string;

  @ManyToOne(() => NonConformity, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'nc_id' })
  nonConformity!: NonConformity;

  @Index()
  @Column({ type: 'uuid', name: 'assignee_id' })
  assigneeId!: string;

  @ManyToOne(() => User, { nullable: false })
  @JoinColumn({ name: 'assignee_id' })
  assignee!: User | null;

  @Column({ type: 'timestamptz', nullable: true, name: 'finished_at' })
  finishedAt?: Date;

  @CreateDateColumn({ type: 'timestamptz', name: 'created_at' })
  createdAt!: Date;

  @UpdateDateColumn({ type: 'timestamptz', name: 'updated_at' })
  updatedAt!: Date;
}
