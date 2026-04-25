import { Column, Entity, PrimaryColumn } from 'typeorm';

@Entity('nc_year_sequences')
export default class NcYearSequence {
  @PrimaryColumn({ type: 'int' })
  year!: number;

  @Column({ type: 'int', name: 'last_seq', default: 0 })
  lastSeq!: number;
}
