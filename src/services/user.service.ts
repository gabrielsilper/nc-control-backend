import { EmailAlreadyExistsError } from 'errors/email-already-exists.error';
import { UserNotFoundError } from 'errors/user-not-found.error';
import IEncrypterService from 'interfaces/encrypter-service';
import UserRepository from 'repositories/user.repository';
import User from '../entities/user';
import { CreateUserDTO } from '../schemas/create-user.schema';
import { UpdateUserDTO } from '../schemas/update-user.schema';
import { FindUsersQuery } from '../schemas/user-queries.schema';

export default class UserService {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly encrypter: IEncrypterService,
  ) {}

  async findAll(filters: FindUsersQuery): Promise<User[]> {
    const { profile, search } = filters;

    const qb = this.userRepository.createQueryBuilder('user');

    if (profile !== undefined) {
      qb.andWhere('user.profile = :profile', { profile });
    }

    if (search) {
      qb.andWhere('(user.name ILIKE :search OR user.email ILIKE :search)', { search: `%${search}%` });
    }

    return qb.getMany();
  }

  async findById(id: string): Promise<User> {
    const user = await this.userRepository.findOneBy({ id });

    if (!user) {
      throw new UserNotFoundError();
    }

    return user;
  }

  findByEmail(email: string) {
    return this.userRepository.findOneBy({ email });
  }

  async create(userData: CreateUserDTO): Promise<User> {
    this.validateEmailExists(userData.email);

    const password = await this.encrypter.encrypt(userData.password);

    const user = this.userRepository.create({ ...userData, password });

    return this.userRepository.save(user);
  }

  async update(id: string, userData: UpdateUserDTO): Promise<User> {
    const user = await this.findById(id);

    if (userData.email && userData.email !== user.email) {
      this.validateEmailExists(userData.email);
    }

    if (userData.password) {
      userData.password = await this.encrypter.encrypt(userData.password);
    }

    const userUpdated = this.userRepository.merge(user, userData);

    return await this.userRepository.save(userUpdated);
  }

  async delete(id: string): Promise<void> {
    const user = await this.findById(id);
    await this.userRepository.remove(user);
  }

  private async validateEmailExists(email: string) {
    const userExists = await this.userRepository.existsBy({
      email,
    });

    if (userExists) {
      throw new EmailAlreadyExistsError();
    }
  }
}
