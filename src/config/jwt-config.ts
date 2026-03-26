import type { SignOptions } from 'jsonwebtoken';

interface JwtConfig {
  access: {
    secret: string;
    expiresIn: SignOptions['expiresIn'];
  };
  refresh: {
    secret: string;
    expiresIn: SignOptions['expiresIn'];
  };
}

export type jwtType = 'access' | 'refresh';

function getEnvOrThrow(name: string): string {
  const value = process.env[name];
  if (!value) {
    throw new Error(`Variável de ambiente ${name} não definida`);
  }
  return value;
}

const jwtConfig: JwtConfig = {
  access: {
    secret: getEnvOrThrow('JWT_ACCESS_SECRET'),
    expiresIn: getEnvOrThrow(
      'JWT_ACCESS_EXPIRATION',
    ) as SignOptions['expiresIn'],
  },
  refresh: {
    secret: getEnvOrThrow('JWT_REFRESH_SECRET'),
    expiresIn: getEnvOrThrow(
      'JWT_REFRESH_EXPIRATION',
    ) as SignOptions['expiresIn'],
  },
};

export function getJwtConfig(type: jwtType) {
  return jwtConfig[type];
}
