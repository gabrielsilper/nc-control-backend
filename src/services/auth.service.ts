import ResponseTokensDTO from 'dtos/response-tokens.dto';
import { InvalidCredentialsError } from 'errors/invalid-credentials.error';
import IEncrypterService from 'interfaces/encrypter-service';
import ITokenService from 'interfaces/token-service';
import RefreshTokenService from './refresh-token.service';
import UserService from './user.service';

export default class AuthService {
  constructor(
    private userService: UserService,
    private refreshTokenService: RefreshTokenService,
    private tokenService: ITokenService,
    private encrypter: IEncrypterService,
  ) {}

  async login(email: string, password: string, userAgent: string, ipAddress: string): Promise<ResponseTokensDTO> {
    const user = await this.userService.findByEmail(email);

    if (!user) {
      throw new InvalidCredentialsError();
    }

    const passwordMatches = this.encrypter.compare(password, user.password);

    if (!passwordMatches) {
      throw new InvalidCredentialsError();
    }

    const accessToken = this.tokenService.generateAcessToken({ sub: user.id, email: user.email, profile: user.profile });
    const currentRefreshToken = await this.refreshTokenService.find(user.id, userAgent);

    if (currentRefreshToken) {
      const refreshToken = await this.refreshTokenService.refresh(currentRefreshToken, ipAddress);
      return { accessToken, refreshToken };
    }

    const refreshToken = await this.refreshTokenService.create(user.id, userAgent, ipAddress);
    return { accessToken, refreshToken };
  }
}
