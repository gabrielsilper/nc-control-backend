import { jwtType } from '../config/jwt-config';

export interface AccessTokenPayload {
  sub: string;
  email: string;
  type: jwtType;
}

export interface RefreshTokenPayload {
  sub: string;
  jti: string;
  type: jwtType;
}
