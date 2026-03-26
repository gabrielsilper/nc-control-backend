import { Repository } from 'typeorm';
import { AppDataSource } from '../config/database';
import User from '../entities/users';
import { Profile } from '../enums/profile.enum';
import bcrypt from 'bcrypt';

export default class UserService {
  private userRepository: Repository<User>;

  constructor() {
    this.userRepository = AppDataSource.getRepository(User);
  }

  async findAll(): Promise<User[]> {
    return await this.userRepository.find({
      select: ['id', 'name', 'email', 'profile', 'createdAt', 'updatedAt'],
      order: { name: 'ASC' }
    });
  }

  async findById(id: string): Promise<User | null> {
    return await this.userRepository.findOne({
      where: { id },
      select: ['id', 'name', 'email', 'profile', 'createdAt', 'updatedAt']
    });
  }

  async findByEmail(email: string): Promise<User | null> {
    return await this.userRepository.findOne({ where: { email } });
  }

  async findByProfile(profile: Profile): Promise<User[]> {
    return await this.userRepository.find({
      where: { profile },
      select: ['id', 'name', 'email', 'profile', 'createdAt', 'updatedAt']
    });
  }

  async findResponsaveis(): Promise<User[]> {
    return await this.userRepository.find({
      where: [{ profile: Profile.RESPONSAVEL }, { profile: Profile.GESTOR }],
      select: ['id', 'name', 'email', 'profile'],
      order: { name: 'ASC' }
    });
  }

  async findInspetores(): Promise<User[]> {
    return await this.userRepository.find({
      where: { profile: Profile.INSPETOR },
      select: ['id', 'name', 'email', 'profile'],
      order: { name: 'ASC' }
    });
  }

  async create(userData: { name: string; email: string; password: string; profile: Profile }): Promise<User> {
    const existingUser = await this.findByEmail(userData.email);
    if (existingUser) throw new Error('Email já cadastrado');
    
    const hashedPassword = await bcrypt.hash(userData.password, 10);
    const user = this.userRepository.create({ ...userData, password: hashedPassword });
    return await this.userRepository.save(user);
  }

  async update(id: string, userData: { name?: string; email?: string; password?: string; profile?: Profile }): Promise<User> {
    const user = await this.findById(id);
    if (!user) throw new Error('Usuário não encontrado');
    
    if (userData.email && userData.email !== user.email) {
      const existingUser = await this.findByEmail(userData.email);
      if (existingUser) throw new Error('Email já cadastrado');
      user.email = userData.email;
    }
    
    if (userData.name) user.name = userData.name;
    if (userData.profile) user.profile = userData.profile;
    if (userData.password) user.password = await bcrypt.hash(userData.password, 10);
    
    return await this.userRepository.save(user);
  }

  async delete(id: string): Promise<void> {
    const user = await this.findById(id);
    if (!user) throw new Error('Usuário não encontrado');
    await this.userRepository.delete(id);
  }

  async validateCredentials(email: string, password: string): Promise<User | null> {
    const user = await this.findByEmail(email);
    if (!user) return null;
    
    const isValid = await bcrypt.compare(password, user.password);
    if (!isValid) return null;
    
    const { password: _, ...userWithoutPassword } = user;
    return userWithoutPassword as User;
  }

  async countByProfile(): Promise<Record<Profile, number>> {
    const result = await this.userRepository
      .createQueryBuilder('user')
      .select('user.profile', 'profile')
      .addSelect('COUNT(user.id)', 'count')
      .groupBy('user.profile')
      .getRawMany();

    const counts = {
      [Profile.INSPETOR]: 0,
      [Profile.GESTOR]: 0,
      [Profile.RESPONSAVEL]: 0
    };

    result.forEach((item) => { counts[item.profile as Profile] = parseInt(item.count); });
    return counts;
  }
}