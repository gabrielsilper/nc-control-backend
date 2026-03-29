import { createHash, randomBytes } from 'node:crypto';
import { getJwtConfig } from 'config/jwt-config';
import ITokenService, { AccessTokenPayload } from 'interfaces/token-service';
import jwt from 'jsonwebtoken';

export class TokenService implements ITokenService {
  generateAcessToken(payload: AccessTokenPayload): string {
    const { secret, expiresIn } = getJwtConfig();
    return jwt.sign(payload, secret, { expiresIn });
  }
  verifyAccessToken(token: string): AccessTokenPayload {
    return jwt.verify(token, getJwtConfig().secret) as AccessTokenPayload;
  }
  generateOpaqueToken(): string {
    return randomBytes(64).toString('hex');
  }

  hashToken(token: string): string {
    return createHash('sha256').update(token).digest('hex');
  }
}
