import {
  IEncrypter,
  IAddAccountRepository,
  IAddAccount,
  INewAccountData,
  IAccountEntitie,
} from './add-account-adapter-protocols'

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
    const hashedPassword: string = await this.encrypterAdapter.encrypt(
      newAccountData.password,
    )
    const createdAccount: IAccountEntitie = await this.addAccountRepository.add(
      Object.assign({}, newAccountData, { password: hashedPassword }),
    )
    return createdAccount
  }
}
