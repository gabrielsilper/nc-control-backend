import { Profile } from 'enums/profile.enum';
import { Request } from 'express';

export default interface ITokenService {
  generateAcessToken(payload: AccessTokenPayload): string;
  verifyAccessToken(token: string): AccessTokenPayload;
  generateOpaqueToken(): string;
  hashToken(token: string): string;
}

export interface AccessTokenPayload {
  sub: string;
  email: string;
  profile: Profile;
}

export type RequestWithPayload = Request & { payload: AccessTokenPayload };
