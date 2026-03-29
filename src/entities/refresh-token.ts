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
import User from './user';

@Entity('refresh_tokens')
export default class RefreshToken {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ type: 'varchar', unique: true, nullable: false })
  token!: string;

  @Index()
  @Column({ type: 'uuid', name: 'user_id' })
  userId!: string;

  @ManyToOne(() => User, { nullable: false, onDelete: 'CASCADE' })
  @JoinColumn({ name: 'user_id' })
  user!: User;

  @Column({ type: 'timestamptz', nullable: false, name: 'expiration_date' })
  expirationDate!: Date;

  @Column({ type: 'varchar', nullable: false, name: 'user_agent' })
  userAgent!: string;

  @Column({ type: 'varchar', nullable: false, name: 'ip_address' })
  ipAddress!: string;

  @CreateDateColumn({ type: 'timestamptz', nullable: false, name: 'created_at' })
  createdAt!: Date;

  @UpdateDateColumn({ type: 'timestamptz', name: 'last_refresh' })
  lastRefresh!: Date;

  @Column({ type: 'boolean', default: false })
  revoked!: boolean;

  @Column({ type: 'timestamptz', nullable: true, name: 'revoked_at' })
  revokedAt?: Date;
}
