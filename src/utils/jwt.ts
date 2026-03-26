import type {
  AccessTokenPayload,
  RefreshTokenPayload,
} from 'interfaces/token-payload';
import type ITokenService from 'interfaces/token-service';
import jwt from 'jsonwebtoken';
import { getJwtConfig } from '../config/jwt-config';

export default class Jwt implements ITokenService {
  generate(payload: AccessTokenPayload | RefreshTokenPayload): string {
    const { secret, expiresIn } = getJwtConfig(payload.type);
    return jwt.sign(payload, secret, { expiresIn });
  }
  verifyAccessToken(token: string): AccessTokenPayload {
    return jwt.verify(
      token,
      getJwtConfig('access').secret,
    ) as AccessTokenPayload;
  }
  verifyRefreshToken(token: string): RefreshTokenPayload {
    return jwt.verify(
      token,
      getJwtConfig('refresh').secret,
    ) as RefreshTokenPayload;
  }
}
