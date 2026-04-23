import { Profile } from 'enums/profile.enum';

export interface AuthUserDTO {
  id: string;
  profile: Profile;
}

export default interface ResponseTokensDTO {
  accessToken: string;
  refreshToken: string;
  user: AuthUserDTO;
}
