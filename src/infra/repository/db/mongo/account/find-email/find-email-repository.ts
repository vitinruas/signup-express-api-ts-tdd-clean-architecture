import { IFindEmailRepository } from './find-email-repository-protocols'
import { mongoHelper } from '../../helpers/mongoHelper'

export class FindEmailMongoRepository implements IFindEmailRepository {
  async find(email: string): Promise<string | undefined> {
    const collectionRef = mongoHelper.getCollection('accounts')
    const response = await collectionRef.findOne({ email })
    return response ? response!.email : undefined
  }
}
