import { IAddAccountRepository } from '../../../../../data/protocols/add-account/add-account-repository-protocol'
import { IAccountEntitie } from '../../../../../domain/entities/account-entitie'
import { INewAccountData } from '../../../../../domain/usecase/add-account-usecase'
import { mongoHelper } from '../helpers/mongoHelper'

export class AddAccountMongoRepository implements IAddAccountRepository {
  async add(newAccountData: INewAccountData): Promise<IAccountEntitie> {
    const collectionRef = mongoHelper.getCollection('accounts')
    const createdUserMongoID = (await collectionRef.insertOne(newAccountData))
      .insertedId
    const createdAccount = await collectionRef.findOne({
      _id: createdUserMongoID,
    })
    return mongoHelper.map(createdAccount)
  }
}
