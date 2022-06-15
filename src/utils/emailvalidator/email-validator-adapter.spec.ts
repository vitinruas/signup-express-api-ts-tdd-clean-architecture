import validator from 'validator'
import { EmailValidatorAdapter } from './email-validator-adapter'

jest.mock('validator', () => ({
  isEmail: (email: string): boolean => {
    return true
  },
}))

describe('Email Validator', () => {
  // return false if invalid email was provided
  it('should return false if invalid email is provided', async () => {
    jest.spyOn(validator, 'isEmail').mockReturnValueOnce(false)

    const sut = new EmailValidatorAdapter()

    const response = await sut.isValid('invalid_email')
    expect(response).toBe(false)
  })
})
