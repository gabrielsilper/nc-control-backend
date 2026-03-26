import { Repository } from 'typeorm';
import { AppDataSource } from '../config/database';
import User from '../entities/users';
import bcrypt from 'bcrypt';

export default class UserService {
  private userRepository: Repository<User>;

  constructor() {
    this.userRepository = AppDataSource.getRepository(User);
  }

  async findAll(): Promise<User[]> {
    return await this.userRepository.find();
  }

  async findById(id: string): Promise<User | null> {
    return await this.userRepository.findOne({ where: { id } });
  }

  async create(userData: { name: string; email: string; password: string; profile: string }): Promise<User> {
    const existingUser = await this.userRepository.findOne({ where: { email: userData.email } });
    if (existingUser) throw new Error('Email já cadastrado');
    
    const hashedPassword = await bcrypt.hash(userData.password, 10);
    const user = this.userRepository.create({ ...userData, password: hashedPassword });
    return await this.userRepository.save(user);
  }

  async update(id: string, userData: Partial<User>): Promise<User> {
    const user = await this.findById(id);
    if (!user) throw new Error('Usuário não encontrado');
    
    if (userData.password) userData.password = await bcrypt.hash(userData.password, 10);
    
    Object.assign(user, userData);
    return await this.userRepository.save(user);
  }

  async delete(id: string): Promise<void> {
    const user = await this.findById(id);
    if (!user) throw new Error('Usuário não encontrado');
    await this.userRepository.delete(id);
  }
}