import { ICheckEmail } from '../../domain/usecase/check-email-usecase'
import { ICheckEmailRepository } from '../protocols/check-email-repository'

export class CheckEmailAdapter implements ICheckEmail {
  private readonly checkEmailRepository: ICheckEmailRepository
  constructor(checkEmailRepository: ICheckEmailRepository) {
    this.checkEmailRepository = checkEmailRepository
  }

  async check(email: string): Promise<any> {
    const alreadyExists = await this.checkEmailRepository.find(email)
    if (alreadyExists) return true
    return false
  }
}
