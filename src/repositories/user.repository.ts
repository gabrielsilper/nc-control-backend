import { appDataSource } from 'database/app-data-source';
import User from 'entities/user';
import { Repository } from 'typeorm';

export default class UserRepository extends Repository<User> {
  constructor() {
    super(User, appDataSource.manager);
  }
}
