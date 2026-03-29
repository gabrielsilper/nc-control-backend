import RefreshTokenRepository from 'repositories/refresh-token.repository';

export default class RefreshTokenService {
  constructor(private readonly refreshTokenRepository: RefreshTokenRepository) {}

  create() {
    this.refreshTokenRepository.create();
  }
}
