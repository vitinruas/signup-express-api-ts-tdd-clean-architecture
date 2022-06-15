import { IAccountEntitie } from '../../../domain/entities/account-entitie'
import {
  IAddAccount,
  INewAccountData,
} from '../../../domain/usecase/add-account-usecase'
import {
  IEncrypter,
  IAddAccountRepository,
} from './add-account-adapter-protocols'
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
        id: 'created_id',
        name: 'created_name',
        gender: 'N',
        email: 'created_email@mail.com',
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
  // calls Encrypter Adapter with correct values
  it('should calls Encrypter Adapter with correct values', async () => {
    const { sut, encrypterAdapter } = makeSut()

    const encryptSpy = jest.spyOn(encrypterAdapter, 'encrypt')

    const newAccountData: INewAccountData = {
      name: 'any_name',
      gender: 'N',
      email: 'any_email@mail.com',
      password: 'any_password',
    }

    await sut.add(newAccountData)

    expect(encryptSpy).toBeCalledWith('any_password')
  })
  // return a hashed password
  it('should EncrypterAdapter returns a hashed password', async () => {
    const { sut } = makeSut()

    const newAccountData: INewAccountData = {
      name: 'any_name',
      gender: 'N',
      email: 'any_email@mail.com',
      password: 'any_password',
    }

    const response = await sut.add(newAccountData)

    expect(response.password).toBe('hashed_password')
  })
  // return throw if EncrypterAdapter throws
  it('should return throw if EncrypterAdapter throws', async () => {
    const { sut, encrypterAdapter } = makeSut()

    jest.spyOn(encrypterAdapter, 'encrypt').mockImplementationOnce(() => {
      return Promise.reject(new Error())
    })

    const newAccountData: INewAccountData = {
      name: 'any_name',
      gender: 'N',
      email: 'any_email@mail.com',
      password: 'any_password',
    }

    const response = sut.add(newAccountData)

    await expect(response).rejects.toThrow()
  })
  // calls AddAccountRepository with correct values
  it('should calls AddAccountRepository with correct values', async () => {
    const { sut, addAccountRepository } = makeSut()

    const addSpy = jest.spyOn(addAccountRepository, 'add')

    const newAccountData: INewAccountData = {
      name: 'any_name',
      gender: 'N',
      email: 'any_email@mail.com',
      password: 'any_password',
    }

    await sut.add(newAccountData)

    expect(addSpy).toHaveBeenCalledWith({
      name: 'any_name',
      gender: 'N',
      email: 'any_email@mail.com',
      password: 'hashed_password',
    })
  })
  // return throw if AdapterAccountRepository throws
  it('should throw if AdapterAccountRepository throws', async () => {
    const { sut, addAccountRepository } = makeSut()

    jest.spyOn(addAccountRepository, 'add').mockImplementationOnce(() => {
      return Promise.reject(new Error())
    })

    const newAccountData: INewAccountData = {
      name: 'any_name',
      gender: 'N',
      email: 'any_email@mail.com',
      password: 'any_password',
    }

    const response = sut.add(newAccountData)

    await expect(response).rejects.toThrow()
  })
  // return an account on success
  it('should return an account on success', async () => {
    const { sut } = makeSut()

    const newAccountData: INewAccountData = {
      name: 'any_name',
      gender: 'N',
      email: 'any_email@mail.com',
      password: 'any_password',
    }

    const response = await sut.add(newAccountData)
    expect(response).toEqual({
      id: 'created_id',
      name: 'created_name',
      gender: 'N',
      email: 'created_email@mail.com',
      password: 'hashed_password',
    })
  })
})
