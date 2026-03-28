import { appDataSource } from 'database/app-data-source';
import RefreshToken from 'entities/refresh-token';
import { Repository } from 'typeorm';

export default class RefreshTokenRepository extends Repository<RefreshToken> {
  constructor() {
    super(RefreshToken, appDataSource.manager);
  }
}
