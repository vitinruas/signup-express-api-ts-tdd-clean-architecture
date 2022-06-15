import {
  ICheckEmail,
  ICheckEmailRepository,
} from './check-email-adapter-protocols'
import { CheckEmailAdapter } from './check-email-adapter'

const makeCheckEmailRepositoryStub = (): ICheckEmailRepository => {
  class CheckEmailRepository implements ICheckEmailRepository {
    find(email: string): Promise<boolean> {
      return Promise.resolve(false)
    }
  }
  return new CheckEmailRepository()
}

interface ISut {
  sut: ICheckEmail
  checkEmailRepository: ICheckEmailRepository
}

const makeSut = (): ISut => {
  const checkEmailRepository = makeCheckEmailRepositoryStub()
  const sut = new CheckEmailAdapter(checkEmailRepository)

  return {
    sut,
    checkEmailRepository,
  }
}

describe('Email Check Validator', () => {
  // calls EmailCheckRepository with correct values
  it('should calls EmailCheckRepository with correct values', async () => {
    const { sut, checkEmailRepository } = makeSut()

    const findSpy = jest.spyOn(checkEmailRepository, 'find')

    const email = 'any_email@mail.com'

    await sut.check(email)

    expect(findSpy).toHaveBeenCalledWith('any_email@mail.com')
  })
  // return false if the provided email already exists
  it('should return false if the provided email already exists', async () => {
    const { sut, checkEmailRepository } = makeSut()

    jest
      .spyOn(checkEmailRepository, 'find')
      .mockReturnValueOnce(Promise.resolve(true))

    const email = 'any_email@mail.com'

    const response = await sut.check(email)

    expect(response).toBe(true)
  })
  // return throw if CheckEmailRepository throws
  it('should return throw if CheckEmailRepository throws', async () => {
    const { sut, checkEmailRepository } = makeSut()

    jest.spyOn(checkEmailRepository, 'find').mockImplementationOnce(() => {
      return Promise.reject(new Error())
    })

    const email = 'any_email@mail.com'

    const response = sut.check(email)

    await expect(response).rejects.toThrow()
  })
})
