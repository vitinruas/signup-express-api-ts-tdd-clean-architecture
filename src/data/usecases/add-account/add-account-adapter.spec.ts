import {
  IEncrypter,
  IAddAccountRepository,
  IAddAccount,
  INewAccountData,
  IAccountEntitie,
} from './add-account-adapter-protocols'
import { AddAccountAdapter } from './add-account-adapter'

// this data come from SignUpController
const makeFakeNewAccountData = (
  withCriptography: boolean = false,
): INewAccountData => {
  const newAccountData: INewAccountData = {
    name: 'any_name',
    gender: 'N',
    email: 'any_email@gmail.com',
    password: 'any_password',
  }
  if (withCriptography) {
    newAccountData.password = 'hashed_password'
  }
  return newAccountData
}

// it's returned when a new account is added to database
const makeFakeCreatedAccountData = (): IAccountEntitie => ({
  id: 'created_id',
  name: 'created_account',
  gender: 'N',
  email: 'created_email@mail.com',
  password: 'hashed_password',
})

// make EncrypterAdapter, it'll will encrypt the user's password
const makeEncrypterStub = (): IEncrypter => {
  class EncrypterAdapterStub implements IEncrypter {
    async encrypt(password: string): Promise<string> {
      return Promise.resolve('hashed_password')
    }
  }
  return new EncrypterAdapterStub()
}

// make AddAccountRepository, it'll will add the validated account to database
const makeAddAccountRepositoryStub = (): IAddAccountRepository => {
  class AddAccountRepositoryStub implements IAddAccountRepository {
    async add(newAccountData: INewAccountData): Promise<IAccountEntitie> {
      return Promise.resolve(makeFakeCreatedAccountData())
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
  const addAccountRepository: IAddAccountRepository =
    makeAddAccountRepositoryStub()
  const encrypterAdapter: IEncrypter = makeEncrypterStub()

  const sut: IAddAccount = new AddAccountAdapter(
    encrypterAdapter,
    addAccountRepository,
  )

  return {
    sut,
    encrypterAdapter,
    addAccountRepository,
  }
}

describe('AddAccountAdapter', () => {
  // call AddAccountAdapter with correct values
  it('should called with correct values', async () => {
    const { sut }: ISut = makeSut()
    const addSpy = jest.spyOn(sut, 'add')

    await sut.add(makeFakeNewAccountData())

    expect(addSpy).toBeCalledWith(makeFakeNewAccountData())
  })

  // call EncrypterAdapter with correct values
  it('should call EncrypterAdapter with correct values', async () => {
    const { sut, encrypterAdapter } = makeSut()
    const encryptSpy = jest.spyOn(encrypterAdapter, 'encrypt')

    await sut.add(makeFakeNewAccountData())

    expect(encryptSpy).toBeCalledWith('any_password')
  })

  // return a hashed password
  it('should EncrypterAdapter returns a hashed password', async () => {
    const { sut }: ISut = makeSut()

    const response: INewAccountData = await sut.add(makeFakeNewAccountData())

    expect(response.password).toBe('hashed_password')
  })

  // return throw if EncrypterAdapter throws
  it('should return throw if EncrypterAdapter throws', async () => {
    const { sut, encrypterAdapter }: ISut = makeSut()
    jest.spyOn(encrypterAdapter, 'encrypt').mockImplementationOnce(() => {
      return Promise.reject(new Error())
    })

    const response: Promise<IAccountEntitie> = sut.add(makeFakeNewAccountData())

    await expect(response).rejects.toThrow()
  })

  // call AddAccountRepository with correct values
  it('should call AddAccountRepository with correct values', async () => {
    const { sut, addAccountRepository }: ISut = makeSut()
    const addSpy = jest.spyOn(addAccountRepository, 'add')

    await sut.add(makeFakeNewAccountData())

    expect(addSpy).toHaveBeenCalledWith(makeFakeNewAccountData(true))
  })

  // return throw if AdapterAccountRepository throws
  it('should throw if AdapterAccountRepository throws', async () => {
    const { sut, addAccountRepository }: ISut = makeSut()
    jest.spyOn(addAccountRepository, 'add').mockImplementationOnce(() => {
      return Promise.reject(new Error())
    })

    const response: Promise<IAccountEntitie> = sut.add(makeFakeNewAccountData())

    await expect(response).rejects.toThrow()
  })

  // return an account on success
  it('should return an account on success', async () => {
    const { sut }: ISut = makeSut()

    const response: IAccountEntitie = await sut.add(makeFakeNewAccountData())

    expect(response).toEqual(makeFakeCreatedAccountData())
  })
})
