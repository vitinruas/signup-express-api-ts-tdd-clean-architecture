import { IFindEmailRepository } from '../../../../data/protocols/check-email/find-email-repository-protocol'

export class FindEmailRepository implements IFindEmailRepository {
  async find(email: string): Promise<string | undefined> {
    return Promise.resolve('email')
  }
}
