import { IAccountEntitie } from '../../domain/entities/account-entitie'
import {
  IAddAccount,
  INewAccountData,
} from '../../domain/usecase/add-account-usecase'
import { IAddAccountRepository } from '../protocols/add-account-repository'
import { IEncrypter } from '../protocols/encrypter-protocol'
import { AddAccountAdapter } from './add-account-adapter'

const makeEncrypterStub = (): IEncrypter => {
  class EncrypterAdapterStub implements IEncrypter {
    async encrypt(password: string): Promise<string> {
      return Promise.resolve('hashed_password')
    }
  }
  return new EncrypterAdapterStub()
}

const makeAddAccountRepositoryStub = (): IAddAccountRepository => {
  class AddAccountRepositoryStub implements IAddAccountRepository {
    async add(newAccountData: INewAccountData): Promise<IAccountEntitie> {
      return Promise.resolve({
        id: 'any_id',
        name: 'any_name',
        gender: 'N',
        email: 'any_email@mail.com',
        password: 'hashed_password',
      })
    }
  }
  return new AddAccountRepositoryStub()
}

interface ISut {
  sut: IAddAccount
  encrypterAdapter: IEncrypter
  addAccountRepository: IAddAccountRepository
}

const makeSut = (): ISut => {
  const addAccountRepository = makeAddAccountRepositoryStub()
  const encrypterAdapter = makeEncrypterStub()

  const sut = new AddAccountAdapter(encrypterAdapter, addAccountRepository)

  return {
    sut,
    encrypterAdapter,
    addAccountRepository,
  }
}

describe('Add Account Adapter', () => {
  // calls Add Account Adapter with correct values
  it('should called with correct values', async () => {
    const { sut } = makeSut()

    const addSpy = jest.spyOn(sut, 'add')

    const newAccountData: INewAccountData = {
      name: 'any_name',
      gender: 'N',
      email: 'any_email@mail.com',
      password: 'any_password',
    }

    await sut.add(newAccountData)

    expect(addSpy).toBeCalledWith({
      name: 'any_name',
      gender: 'N',
      email: 'any_email@mail.com',
      password: 'any_password',
    })
  })
})
