import UserRepository from 'repositories/user.repository';

export default class UserService {
  constructor(private userRepository: UserRepository) {}
}
