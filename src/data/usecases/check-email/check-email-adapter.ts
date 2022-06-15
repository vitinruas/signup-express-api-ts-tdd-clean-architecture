import {
  ICheckEmail,
  ICheckEmailRepository,
} from './check-email-adapter-protocols'

export class CheckEmailAdapter implements ICheckEmail {
  private readonly checkEmailRepository: ICheckEmailRepository
  constructor(checkEmailRepository: ICheckEmailRepository) {
    this.checkEmailRepository = checkEmailRepository
  }

  async check(email: string): Promise<boolean> {
    const alreadyExists = await this.checkEmailRepository.find(email)
    if (alreadyExists) return true
    return false
  }
}
