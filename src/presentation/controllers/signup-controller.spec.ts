import { InvalidParamError } from '../errors/invalid-param-error'
import { MissingParamError } from '../errors/missing-param-error'
import { IController } from '../protocols/controller-protocol'
import { SignUpController } from './signup-controller'

interface ISut {
  sut: IController
}
const makeSut = (): ISut => {
  const sut = new SignUpController()
  return {
    sut,
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
})
