import UserService from 'services/user.service';

export default class Controller {
  constructor(private readonly userService: UserService) {}
}
