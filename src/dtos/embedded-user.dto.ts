import { Profile } from 'enums/profile.enum';

export default interface EmbeddedUserDTO {
  id: string;
  name: string;
  profile: Profile;
}
