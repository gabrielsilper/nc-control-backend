import { MoreThan } from 'typeorm';
import RefreshToken from 'entities/refresh-token';
import ITokenService from 'interfaces/token-service';
import RefreshTokenRepository from 'repositories/refresh-token.repository';

export default class RefreshTokenService {
  constructor(
    private readonly refreshTokenRepository: RefreshTokenRepository,
    private readonly tokenService: ITokenService,
    private readonly expiresDays: number,
  ) {}

  async create(userId: string, userAgent: string, ipAddress: string) {
    const token = this.tokenService.generateOpaqueToken();
    const hashedToken = this.tokenService.hashToken(token);

    const refreshToken = this.refreshTokenRepository.create({
      token: hashedToken,
      userId,
      expirationDate: this.getNewExpiresDate(),
      userAgent,
      ipAddress,
    });

    await this.refreshTokenRepository.save(refreshToken);

    return token;
  }

  async find(userId: string, userAgent: string) {
    return this.refreshTokenRepository.findOneBy({
      expirationDate: MoreThan(new Date()),
      revoked: false,
      userId,
      userAgent,
    });
  }

  async refresh(currentRefreshToken: RefreshToken, ipAddress: string): Promise<string> {
    const token = this.tokenService.generateOpaqueToken();
    const hashedToken = this.tokenService.hashToken(token);

    await this.refreshTokenRepository.update(
      {
        id: currentRefreshToken.id,
      },
      {
        revoked: false,
        revokedAt: () => 'NULL',
        token: hashedToken,
        expirationDate: this.getNewExpiresDate(),
        ipAddress,
      },
    );

    return token;
  }

  private getNewExpiresDate(): Date {
    const expiresInMs = 1000 * 60 * 60 * 24 * this.expiresDays;
    return new Date(Date.now() + expiresInMs);
  }

  async findByToken(token: string) {
    const hashedToken = this.tokenService.hashToken(token);

    return this.refreshTokenRepository.findOne({
      where: { token: hashedToken },
      relations: {
        user: true,
      },
    });
  }

  async revokeToken(refreshToken: RefreshToken) {
    await this.refreshTokenRepository.update(
      {
        id: refreshToken.id,
      },
      {
        revoked: true,
        revokedAt: () => 'CURRENT_TIMESTAMP',
      },
    );
  }

  async revokeAllTokens(userId: string) {
    await this.refreshTokenRepository.update(
      {
        userId,
      },
      {
        revoked: true,
        revokedAt: () => 'CURRENT_TIMESTAMP',
      },
    );
  }
}
