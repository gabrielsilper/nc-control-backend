import { Column, CreateDateColumn, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import User from './users';

@Entity('refresh_tokens')
export default class RefreshToken {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ type: 'varchar', unique: true, nullable: false })
  token!: string;

  @ManyToOne(() => User, { nullable: false, onDelete: 'CASCADE' })
  user!: User;

  @Column({ type: 'timestamp', nullable: false })
  expirationDate!: Date;

  @CreateDateColumn({ type: 'timestamp', nullable: false })
  createdAt!: Date;

  @Column({ type: 'varchar', nullable: true })
  userAgent!: string | null;

  @Column({ type: 'varchar', nullable: true })
  ipAddress!: string | null;

  @Column({ type: 'boolean', default: false })
  revoked!: boolean;
}