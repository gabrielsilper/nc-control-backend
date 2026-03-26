import { Profile } from 'enums/profile.enum';

export default interface ResponseUserDTO {
  id: string;
  name: string;
  email: string;
  profile: Profile;
}
