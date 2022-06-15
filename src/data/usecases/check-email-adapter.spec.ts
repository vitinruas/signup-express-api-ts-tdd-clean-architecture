import { ICheckEmail } from '../../domain/usecase/check-email-usecase'
import { ICheckEmailRepository } from '../protocols/check-email-repository'
import { CheckEmailAdapter } from './check-email-adapter'

const makeCheckEmailRepositoryStub = (): ICheckEmailRepository => {
  class CheckEmailRepository implements ICheckEmailRepository {
    find(email: string): Promise<object> {
      return Promise.resolve({})
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
})
