import { Profile } from 'enums/profile.enum';
import {
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import NonConformity from './non-conformity';


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

  @CreateDateColumn({ name: 'created_at' })
  createdAt!: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt!: Date;

  //RELACIONAMENTO COM A ENTIDADE NON CONFORMITY
  @OneToMany (() => NonConformity, (nc) => nc.createdBy)
  createdNonConformities!: NonConformity[];

  @OneToMany(() => NonConformity, (nc) => nc.assignedTo)
  assignedNonConformities!: NonConformity[];
}
