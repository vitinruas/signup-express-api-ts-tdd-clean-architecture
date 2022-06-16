import {
  ICheckEmail,
  IFindEmailRepository,
} from './check-email-adapter-protocols'

export class CheckEmailAdapter implements ICheckEmail {
  private readonly findEmailRepository: IFindEmailRepository
  constructor(findEmailRepository: IFindEmailRepository) {
    this.findEmailRepository = findEmailRepository
  }

  async check(email: string): Promise<boolean> {
    const alreadyExists = await this.findEmailRepository.find(email)
    if (alreadyExists) return true
    return false
  }
}
