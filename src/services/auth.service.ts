import ResponseTokensDTO from 'dtos/response-tokens.dto';
import { InvalidCredentialsError } from 'errors/invalid-credentials.error';
import RefreshTokenValidationError from 'errors/refresh-token-validation.error';
import IEncrypterService from 'interfaces/encrypter-service';
import ITokenService from 'interfaces/token-service';
import RefreshTokenService from './refresh-token.service';
import UserService from './user.service';

export default class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly refreshTokenService: RefreshTokenService,
    private readonly tokenService: ITokenService,
    private readonly encrypter: IEncrypterService,
  ) {}

  async login(email: string, password: string, userAgent: string, ipAddress: string): Promise<ResponseTokensDTO> {
    const user = await this.userService.findByEmail(email);

    if (!user) {
      throw new InvalidCredentialsError();
    }

    const passwordMatches = await this.encrypter.compare(password, user.password);

    if (!passwordMatches) {
      throw new InvalidCredentialsError();
    }

    const accessToken = this.tokenService.generateAcessToken({ sub: user.id, email: user.email, profile: user.profile });
    const currentRefreshToken = await this.refreshTokenService.find(user.id, userAgent);

    if (currentRefreshToken) {
      const refreshToken = await this.refreshTokenService.refresh(currentRefreshToken, ipAddress);
      return { accessToken, refreshToken, user: { id: user.id, profile: user.profile } };
    }

    const refreshToken = await this.refreshTokenService.create(user.id, userAgent, ipAddress);
    return { accessToken, refreshToken, user: { id: user.id, profile: user.profile } };
  }

  async refresh(refreshToken: string, userAgent: string, ipAddress: string): Promise<ResponseTokensDTO> {
    const storedToken = await this.refreshTokenService.findByToken(refreshToken);

    if (!storedToken) {
      throw new RefreshTokenValidationError();
    }

    if (storedToken.userAgent !== userAgent) {
      throw new RefreshTokenValidationError();
    }

    if (storedToken.expirationDate < new Date()) {
      throw new RefreshTokenValidationError();
    }

    if (storedToken.revoked) {
      throw new RefreshTokenValidationError();
    }

    const accessToken = this.tokenService.generateAcessToken({
      sub: storedToken.userId,
      email: storedToken.user.email,
      profile: storedToken.user.profile,
    });

    const newRefreshToken = await this.refreshTokenService.refresh(storedToken, ipAddress);

    return {
      accessToken,
      refreshToken: newRefreshToken,
      user: { id: storedToken.userId, profile: storedToken.user.profile },
    };
  }

  async logout(refreshToken: string, userAgent: string) {
    const storedToken = await this.refreshTokenService.findByToken(refreshToken);

    if (!storedToken) {
      throw new RefreshTokenValidationError();
    }

    if (storedToken.userAgent !== userAgent) {
      throw new RefreshTokenValidationError();
    }

    if (storedToken.expirationDate < new Date()) {
      throw new RefreshTokenValidationError();
    }

    if (storedToken.revoked) {
      throw new RefreshTokenValidationError();
    }

    await this.refreshTokenService.revokeToken(storedToken);
  }

  async logoutAll(userId: string) {
    await this.refreshTokenService.revokeAllTokens(userId);
  }
}
