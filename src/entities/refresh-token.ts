import { Column, CreateDateColumn, Entity, Index, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import User from './user';

@Entity('refresh_tokens')
export default class RefreshToken {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ type: 'varchar', unique: true, nullable: false })
  token!: string;

  @Index()
  @Column({ type: 'uuid', name: 'user_id' })
  userID!: string;

  @ManyToOne(() => User, { nullable: false, onDelete: 'CASCADE' })
  @JoinColumn({ name: 'user_id' })
  user!: User;

  @Column({ type: 'timestamptz', nullable: false })
  expirationDate!: Date;

  @Column({ type: 'varchar', nullable: true })
  userAgent?: string;

  @Column({ type: 'varchar', nullable: true })
  ipAddress?: string;

  @CreateDateColumn({ type: 'timestamptz', nullable: false })
  createdAt!: Date;

  @Column({ type: 'boolean', default: false })
  revoked!: boolean;

  @Column({ type: 'timestamptz', nullable: true, name: 'revoked_at' })
  revokedAt?: Date;
}