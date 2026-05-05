import { NcHistoryEventType } from 'enums/nc-history-event-type.enum';
import { Column, Entity, Index, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import NonConformity from './non-conformity';
import User from './user';

@Entity('nc_histories')
export default class NcHistory {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Index()
  @Column({ type: 'uuid', name: 'nc_id' })
  ncId!: string;

  @ManyToOne(() => NonConformity, (nc) => nc.histories)
  @JoinColumn({ name: 'nc_id' })
  nonConformity!: NonConformity;

  @Column({ type: 'uuid', name: 'actor_id' })
  actorId!: string;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'actor_id' })
  actor!: User;

  @Column({ type: 'enum', enum: NcHistoryEventType, name: 'event_type' })
  eventType!: NcHistoryEventType;

  @Column({ type: 'jsonb', nullable: true })
  metadata?: Record<string, unknown>;

  @Column({ type: 'timestamptz', name: 'occurred_at', default: () => 'NOW()' })
  occurredAt!: Date;
}
