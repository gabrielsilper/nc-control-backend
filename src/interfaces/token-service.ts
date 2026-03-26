import type { AccessTokenPayload, RefreshTokenPayload } from './token-payload';

export default interface ITokenService {
  generate(payload: AccessTokenPayload | RefreshTokenPayload): string;
  verifyAccessToken(token: string): AccessTokenPayload;
  verifyRefreshToken(token: string): RefreshTokenPayload;
}
