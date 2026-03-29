import { Profile } from 'enums/profile.enum';
import { Column, CreateDateColumn, Entity, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';
import NonConformity from './non-conformity';
import RefreshToken from './refresh-token';

@Entity('users')
export default class User {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ type: 'varchar', nullable: false })
  name!: string;

  @Column({ type: 'text', nullable: false })
  password!: string;

  @Column({ type: 'text', nullable: false })
  email!: string;

  @Column({ type: 'enum', nullable: false, enum: Profile })
  profile!: Profile;

  @CreateDateColumn({ type: 'timestamptz', name: 'created_at' })
  createdAt!: Date;

  @UpdateDateColumn({ type: 'timestamptz', name: 'updated_at' })
  updatedAt!: Date;

  @OneToMany(
    () => RefreshToken,
    (refreshToken) => refreshToken.user,
  )
  refreshTokens!: RefreshToken[];

  @OneToMany(
    () => NonConformity,
    (nc) => nc.createdBy,
  )
  createdNonConformities!: NonConformity[];

  @OneToMany(
    () => NonConformity,
    (nc) => nc.assignedTo,
  )
  assignedNonConformities!: NonConformity[];
}
