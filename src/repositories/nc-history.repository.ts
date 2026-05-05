import { appDataSource } from 'database/app-data-source';
import NcHistory from 'entities/nc-history';
import { Repository } from 'typeorm';

export default class NcHistoryRepository extends Repository<NcHistory> {
  constructor() {
    super(NcHistory, appDataSource.manager);
  }
}
