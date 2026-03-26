import { Profile } from 'enums/profile.enum';

export default interface UserCreateDTO {
  name: string;
  password: string;
  email: string;
  profile: Profile;
}
