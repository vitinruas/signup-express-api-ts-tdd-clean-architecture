import { IEncrypter } from '../../../data/protocols/add-account/encrypter-protocol'
import bcrypt from 'bcrypt'

export class BcryptAdapter implements IEncrypter {
  private readonly salt: number
  constructor(salt: number) {
    this.salt = salt
  }

  async encrypt(password: string): Promise<string> {
    const hashedPassword = await bcrypt.hash(password, this.salt)
    return hashedPassword
  }
}
