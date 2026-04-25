import { appDataSource } from 'database/app-data-source';
import NcYearSequence from 'entities/nc-year-sequence';
import { Repository } from 'typeorm';

export default class NcYearSequenceRepository extends Repository<NcYearSequence> {
  constructor() {
    super(NcYearSequence, appDataSource.manager);
  }

  async nextSequence(year: number): Promise<number> {
    const result = await this.manager.query<{ last_seq: number }[]>(
      `INSERT INTO nc_year_sequences (year, last_seq) VALUES ($1, 1)
       ON CONFLICT (year) DO UPDATE SET last_seq = nc_year_sequences.last_seq + 1
       RETURNING last_seq`,
      [year],
    );
    return result[0].last_seq;
  }
}
