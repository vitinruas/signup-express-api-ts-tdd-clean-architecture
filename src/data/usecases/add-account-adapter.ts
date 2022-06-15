import { IAccountEntitie } from '../../domain/entities/account-entitie'
import {
  IAddAccount,
  INewAccountData,
} from '../../domain/usecase/add-account-usecase'
import { IAddAccountRepository } from '../protocols/add-account-repository'
import { IEncrypter } from '../protocols/encrypter-protocol'

export class AddAccountAdapter implements IAddAccount {
  private readonly encrypterAdapter: IEncrypter
  private readonly addAccountRepository: IAddAccountRepository

  constructor(
    encrypterAdapter: IEncrypter,
    addAccountRepository: IAddAccountRepository,
  ) {
    this.encrypterAdapter = encrypterAdapter
    this.addAccountRepository = addAccountRepository
  }

  async add(newAccountData: INewAccountData): Promise<IAccountEntitie> {
    const hashedPassword = await this.encrypterAdapter.encrypt(
      newAccountData.password,
    )
    const createdAccount = await this.addAccountRepository.add(
      Object.assign({}, newAccountData, { password: hashedPassword }),
    )
    return createdAccount
  }
}
