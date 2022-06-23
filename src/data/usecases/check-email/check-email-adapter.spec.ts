import {
  ICheckEmail,
  IFindEmailRepository,
} from './check-email-adapter-protocols'
import { CheckEmailAdapter } from './check-email-adapter'

const makeFakeValidEmail = (): string => 'any_email@mail.com'

const makeCheckEmailRepositoryStub = (): IFindEmailRepository => {
  class CheckEmailRepository implements IFindEmailRepository {
    async find(email: string): Promise<string | undefined> {
      return Promise.resolve(undefined)
    }
  }
  return new CheckEmailRepository()
}

interface ISut {
  sut: ICheckEmail
  checkEmailRepository: IFindEmailRepository
}

const makeSut = (): ISut => {
  const checkEmailRepository: IFindEmailRepository =
    makeCheckEmailRepositoryStub()
  const sut: ICheckEmail = new CheckEmailAdapter(checkEmailRepository)
  return {
    sut,
    checkEmailRepository,
  }
}

describe('Email Check Validator', () => {
  // call EmailCheckRepository with correct values
  it('should call EmailCheckRepository with correct values', async () => {
    const { sut, checkEmailRepository }: ISut = makeSut()
    const findSpy = jest.spyOn(checkEmailRepository, 'find')

    await sut.check(makeFakeValidEmail())

    expect(findSpy).toHaveBeenCalledWith(makeFakeValidEmail())
  })

  // return true if the provided email already exists
  it('should return true if the provided email already exists', async () => {
    const { sut, checkEmailRepository }: ISut = makeSut()
    jest
      .spyOn(checkEmailRepository, 'find')
      .mockReturnValueOnce(Promise.resolve(makeFakeValidEmail()))

    const response: boolean = await sut.check(makeFakeValidEmail())

    expect(response).toBe(true)
  })

  // return throw if CheckEmailRepository throws
  it('should return throw if CheckEmailRepository throws', async () => {
    const { sut, checkEmailRepository }: ISut = makeSut()
    jest.spyOn(checkEmailRepository, 'find').mockImplementationOnce(() => {
      return Promise.reject(new Error())
    })

    const response: Promise<boolean> = sut.check(makeFakeValidEmail())

    await expect(response).rejects.toThrow()
  })

  // return false if the provided email is not exists
  it('should return false if the provided email already exists', async () => {
    const { sut }: ISut = makeSut()

    const response: boolean = await sut.check(makeFakeValidEmail())

    expect(response).toBe(false)
  })
})
