import type { SignOptions } from 'jsonwebtoken';

interface JwtConfig {
  secret: string;
  expiresIn: SignOptions['expiresIn'];
}

function getEnvOrThrow(name: string): string {
  const value = process.env[name];
  if (!value) {
    throw new Error(`Variável de ambiente ${name} não definida`);
  }
  return value;
}

const jwtConfig: JwtConfig = {
  secret: getEnvOrThrow('JWT_ACCESS_SECRET'),
  expiresIn: getEnvOrThrow('JWT_ACCESS_EXPIRATION') as SignOptions['expiresIn'],
};

export function getJwtConfig() {
  return jwtConfig;
}
