import { Profile } from 'enums/profile.enum';

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
