import { SeverityNc } from 'enums/severity_nc.enum';
import { StatusNc } from 'enums/status_nc.enum';
import { TypeNc } from 'enums/type_nc.enum';
import { Column, Entity, JoinColumn, ManyToMany, ManyToOne, OneToOne, PrimaryGeneratedColumn } from 'typeorm';
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

  @Column({ type: "enum", nullable: false, enum: SeverityNc  })
  Severity!: SeverityNc;

  @Column({ type: "enum", nullable: false, enum: StatusNc  })
  Status!: StatusNc;

  @Column({ type: "text", nullable: false})
  Process_line!: string;

  @Column({ type: "text", nullable: false})
  Department!: string;

  //RELACIONAMENTO COM A ENTIDADE USERS

   @ManyToOne (() => User, (user) => user.createdNonConformities)
  createdBy!: User; //criador

  @ManyToOne(() => User, (user) => user.assignedNonConformities, { nullable: true })
  assignedTo!: User; // Responsável

  
  @Column({ type: 'timestamptz', default: () => 'NOW()' })
  openedAt!: Date; // Momento do registro

  @Column({ type: 'timestamptz', nullable: true })
  dueDate!: Date; // Prazo máximo para encerramento

  @Column({ type: 'timestamptz', nullable: true })
  closedAt!: Date; // Momento do encerramento efetivo

  @Column({ type: 'text', nullable: true })
  rootCause!: string; // Descrição da causa raiz identificada

}

