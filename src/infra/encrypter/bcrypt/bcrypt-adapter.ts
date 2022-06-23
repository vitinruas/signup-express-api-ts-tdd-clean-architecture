import bcrypt from 'bcrypt'
import { IEncrypter } from '../../../data/protocols/add-account/encrypter-protocol'

export class BcryptAdapter implements IEncrypter {
  private readonly salt: number

  constructor(salt: number) {
    this.salt = salt
  }

  async encrypt(password: string): Promise<string> {
    const hashedPassword: string = await bcrypt.hash(password, this.salt)
    return hashedPassword
  }
}
