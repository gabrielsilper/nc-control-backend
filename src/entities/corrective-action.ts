import { Status } from 'enums/status.enum';
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import NonConformity from './non-conformity';
import User from './users';

@Entity('corrective_actions')
export default class CorrectiveAction {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ type: 'text', nullable: false })
  description!: string;

  @Column({
    type: 'enum',
    enum: Status,
    default: Status.PENDENTE,
    nullable: false,
  })
  status!: string;

  @Column({ type: 'timestamp', nullable: false })
  deadline!: Date;

  @Column({ type: 'text', nullable: true })
  evidence?: string;

  @ManyToOne(() => NonConformity, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'nc_id' })
  nonConformity!: NonConformity;

  @ManyToOne(() => User, { nullable: false })
  @JoinColumn({ name: 'user_id' })
  assignee!: User;

  @Column({ type: 'timestamp', nullable: true, name: 'finished_at' })
  finishedAt?: Date;

  @CreateDateColumn({ name: 'created_at' })
  createdAt!: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt!: Date;
}
