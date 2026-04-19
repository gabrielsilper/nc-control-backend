import { appDataSource } from 'database/app-data-source';
import CorrectiveAction from 'entities/corrective-action';
import { Repository } from 'typeorm';

export default class CorrectiveActionRepository extends Repository<CorrectiveAction> {
  constructor() {
    super(CorrectiveAction, appDataSource.manager);
  }
}
