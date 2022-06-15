import { IEmailValidator } from '../../presentation/protocols/email-validator-protocol'
import { EmailValidatorAdapter } from './email-validator-adapter'
import validator from 'validator'

jest.mock('validator', () => ({
  isEmail: (email: string): boolean => {
    return true
  },
}))

const makeSut = (): IEmailValidator => new EmailValidatorAdapter()

describe('Email Validator', () => {
  // return false if invalid email was provided
  it('should return false if invalid email is provided', () => {
    const sut = makeSut()

    jest.spyOn(validator, 'isEmail').mockReturnValueOnce(false)

    const response = sut.isValid('invalid_email')

    expect(response).toBe(false)
  })
  // return true if valid email was provided
  it('should return true if valid email is provided', () => {
    const sut = makeSut()

    const response = sut.isValid('valid_email')

    expect(response).toBe(true)
  })
  // return true if valid email was provided
  it('should return true if valid email is provided', () => {
    const sut = makeSut()

    const response = sut.isValid('valid_email')

    expect(response).toBe(true)
  })
  // calls Email Validator with correct values
  it('should calls Email Validator with correct values', () => {
    const sut = makeSut()

    const isEmailSpy = jest.spyOn(validator, 'isEmail')

    sut.isValid('any_email')

    expect(isEmailSpy).toHaveBeenCalledWith('any_email')
  })
})
