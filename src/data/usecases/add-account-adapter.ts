import { IAccountEntitie } from '../../domain/entities/account-entitie'
import {
  IAddAccount,
  INewAccountData,
} from '../../domain/usecase/add-account-usecase'
import { IAddAccountRepository } from '../protocols/add-account-repository'
import { IEncrypter } from '../protocols/encrypter-protocol'

export class AddAccountAdapter implements IAddAccount {
  private readonly encrypter: IEncrypter
  private readonly addAccountRepository: IAddAccountRepository

  constructor(
    encrypter: IEncrypter,
    addAccountRepository: IAddAccountRepository,
  ) {
    this.encrypter = encrypter
    this.addAccountRepository = addAccountRepository
  }

  async add(newAccountData: INewAccountData): Promise<IAccountEntitie> {
    const hashedPassword = await this.encrypter.encrypt(newAccountData.password)
    const createdAccount = await this.addAccountRepository.add(
      Object.assign({}, newAccountData, { password: hashedPassword }),
    )
    return createdAccount
  }
}
