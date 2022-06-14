import { InvalidParamError } from '../errors/invalid-param-error'
import { MissingParamError } from '../errors/missing-param-error'
import { ServerError } from '../errors/server-error'
import { IController } from '../protocols/controller-protocol'
import { IEmailValidator } from '../protocols/email-validator-protocol'
import { SignUpController } from './signup-controller'

interface ISut {
  sut: IController
  emailValidator: IEmailValidator
}
const makeSut = (): ISut => {
  class EmailValidatorStub implements IEmailValidator {
    isValid(email: string): boolean {
      return true
    }
  }
  const emailValidator = new EmailValidatorStub()
  const sut = new SignUpController(emailValidator)
  return {
    sut,
    emailValidator,
  }
}

describe('SignUpController', () => {
  // return 400 if name wasn't provided
  it('should return a 400 error code if no name is provided', () => {
    const { sut } = makeSut()

    const httpRequest = {
      body: {
        gender: 'any_gender',
        email: 'any_email',
        password: 'any_password',
        passwordConfirmation: 'any_password',
      },
    }
    const httpResponse = sut.perform(httpRequest)

    expect(httpResponse.statusCode).toBe(400)
    expect(httpResponse.body).toEqual(new MissingParamError('name'))
  })
  // return 400 if gender wasn't provided
  it('should return a 400 error code if no gender is provided', () => {
    const { sut } = makeSut()

    const httpRequest = {
      body: {
        name: 'any_name',
        email: 'any_email',
        password: 'any_password',
        passwordConfirmation: 'any_password',
      },
    }
    const httpResponse = sut.perform(httpRequest)

    expect(httpResponse.statusCode).toBe(400)
    expect(httpResponse.body).toEqual(new MissingParamError('gender'))
  })
  // return 400 if email wasn't provided
  it('should return a 400 error code if no email is provided', () => {
    const { sut } = makeSut()

    const httpRequest = {
      body: {
        name: 'any_name',
        gender: 'any_gender',
        password: 'any_password',
        passwordConfirmation: 'any_password',
      },
    }
    const httpResponse = sut.perform(httpRequest)

    expect(httpResponse.statusCode).toBe(400)
    expect(httpResponse.body).toEqual(new MissingParamError('email'))
  })
  // return 400 if password wasn't provided
  it('should return a 400 error code if no password is provided', () => {
    const { sut } = makeSut()

    const httpRequest = {
      body: {
        name: 'any_name',
        gender: 'any_gender',
        email: 'any_email',
        passwordConfirmation: 'any_password',
      },
    }
    const httpResponse = sut.perform(httpRequest)

    expect(httpResponse.statusCode).toBe(400)
    expect(httpResponse.body).toEqual(new MissingParamError('password'))
  })
  // return 400 if password confirmation wasn't provided
  it('should return a 400 error code if no password confirmation is provided', () => {
    const { sut } = makeSut()

    const httpRequest = {
      body: {
        name: 'any_name',
        gender: 'any_gender',
        email: 'any_email',
        password: 'any_password',
      },
    }
    const httpResponse = sut.perform(httpRequest)

    expect(httpResponse.statusCode).toBe(400)
    expect(httpResponse.body).toEqual(
      new MissingParamError('passwordConfirmation'),
    )
  })
  // return 400 if no passwords match
  it('should return a 422 error code if no passwords match', () => {
    const { sut } = makeSut()

    const httpRequest = {
      body: {
        name: 'any_name',
        gender: 'any_gender',
        email: 'any_email',
        password: 'diff_password_1',
        passwordConfirmation: 'diff_password_2',
      },
    }
    const httpResponse = sut.perform(httpRequest)

    expect(httpResponse.statusCode).toBe(422)
    expect(httpResponse.body).toEqual(
      new InvalidParamError('passwordConfirmation'),
    )
  })
  // return 422 if invalid email is provided
  it('should return a 422 error code if invalid email is provided', () => {
    const { sut, emailValidator } = makeSut()

    jest.spyOn(emailValidator, 'isValid').mockReturnValueOnce(false)

    const httpRequest = {
      body: {
        name: 'any_name',
        gender: 'any_gender',
        email: 'any_email',
        password: 'any_password',
        passwordConfirmation: 'any_password',
      },
    }
    const httpResponse = sut.perform(httpRequest)

    expect(httpResponse.statusCode).toBe(422)
    expect(httpResponse.body).toEqual(new InvalidParamError('email'))
  })
  // return 500 if Email Validator throws
  it('should return a 500 error code if Email Validator throws', () => {
    const { sut, emailValidator } = makeSut()

    jest.spyOn(emailValidator, 'isValid').mockImplementationOnce(() => {
      throw new Error()
    })

    const httpRequest = {
      body: {
        name: 'any_name',
        gender: 'any_gender',
        email: 'any_email',
        password: 'any_password',
        passwordConfirmation: 'any_password',
      },
    }
    const httpResponse = sut.perform(httpRequest)

    expect(httpResponse.statusCode).toBe(500)
    expect(httpResponse.body).toEqual(new ServerError())
  })
  // return 201 if a valid email is provided
  it('should return a 201 success code if a valid email is provided', () => {
    const { sut } = makeSut()

    const httpRequest = {
      body: {
        name: 'any_name',
        gender: 'any_gender',
        email: 'any_email',
        password: 'any_password',
        passwordConfirmation: 'any_password',
      },
    }
    const httpResponse = sut.perform(httpRequest)

    expect(httpResponse.statusCode).toBe(201)
  })
})
