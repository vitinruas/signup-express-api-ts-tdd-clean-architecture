import { ICheckEmailRepository } from '../protocols/check-email-repository'
import { CheckEmailAdapter } from './check-email-adapter'

describe('Email Check Validator', () => {
  // calls EmailCheckRepository with correct values
  it('should calls EmailCheckRepository with correct values', async () => {
    class CheckEmailRepository implements ICheckEmailRepository {
      find(email: string): Promise<object> {
        return Promise.resolve({})
      }
    }

    const checkEmailRepository = new CheckEmailRepository()
    const sut = new CheckEmailAdapter(checkEmailRepository)

    const findSpy = jest.spyOn(checkEmailRepository, 'find')

    const email = 'any_email@mail.com'

    await sut.check(email)

    expect(findSpy).toHaveBeenCalledWith('any_email@mail.com')
  })
})
