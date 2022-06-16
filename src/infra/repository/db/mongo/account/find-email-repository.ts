import { IFindEmailRepository } from '../../../../../data/protocols/check-email/find-email-repository-protocol'
import { mongoHelper } from '../helpers/mongoHelper'

export class FindEmailRepository implements IFindEmailRepository {
  async find(email: string): Promise<string | undefined> {
    const collectionRef = mongoHelper.getCollection('accounts')
    const foundUser = await collectionRef.findOne({ email })
    return foundUser!.email
  }
}
