import type { SignOptions } from 'jsonwebtoken';
import { getEnvOrThrow } from './environment';

interface JwtConfig {
  secret: string;
  expiresIn: SignOptions['expiresIn'];
}

const jwtConfig: JwtConfig = {
  secret: getEnvOrThrow('JWT_ACCESS_SECRET'),
  expiresIn: getEnvOrThrow('JWT_ACCESS_EXPIRATION') as SignOptions['expiresIn'],
};

export function getJwtConfig() {
  return jwtConfig;
}
