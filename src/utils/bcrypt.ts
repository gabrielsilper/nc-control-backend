import bcrypt from 'bcrypt';
import type IEncrypterService from 'interfaces/encrypter-service';

export default class Bcrypt implements IEncrypterService {
  private bcrypt = bcrypt;

  encrypt(password: string): Promise<string> {
    return this.bcrypt.hash(password, 10);
  }
  compare(password: string, hash: string): Promise<boolean> {
    return this.bcrypt.compare(password, hash);
  }
}
