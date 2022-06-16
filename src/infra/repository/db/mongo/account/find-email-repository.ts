import { IFindEmailRepository } from '../../../../../data/protocols/check-email/find-email-repository-protocol'
import { mongoHelper } from '../helpers/mongoHelper'

export class FindEmailRepository implements IFindEmailRepository {
  async find(email: string): Promise<string | undefined> {
    const collectionRef = mongoHelper.getCollection('accounts')
    const response = await collectionRef.findOne({ email })
    return response ? response!.email : undefined
  }
}
