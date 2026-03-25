import { TypeNc } from 'enums/type_nc.enum';
import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

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

  //parei na gravidade
}
