import { IAccountEntitie } from '../../domain/entities/account-entitie'
import { INewAccountData } from '../../domain/usecase/add-account-usecase'

export interface IAddAccountRepository {
  add(newAccountData: INewAccountData): Promise<IAccountEntitie>
}
