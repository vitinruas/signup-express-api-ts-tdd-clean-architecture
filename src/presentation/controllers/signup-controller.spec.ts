import { IAccountEntitie } from '../../domain/entities/account-entitie'
import {
  IAddAccount,
  INewAccountData,
} from '../../domain/usecase/add-account-usecase'
import { InvalidParamError, MissingParamError } from '../errors'
import {
  IController,
  IEmailValidator,
  IHttpRequest,
  IHttpResponse,
} from './signup-controller-protocols'
import { SignUpController } from './signup-controller'
import { ICheckEmail } from '../../domain/usecase/check-email-usecase'
import { ParamAlreadyExistsError } from '../errors/param-exists-error'
import { badRequest, serverError } from '../helpers'

// fake valid data will be used for success requests
const makeFakeValidRequest = (): IHttpRequest => ({
  body: {
    name: 'any_name',
    gender: 'N',
    email: 'any_email',
    password: 'any_password',
    passwordConfirmation: 'any_password',
  },
})

// fake valid data will be used for success responses
const makeFakeValidResponse = (): IAccountEntitie => ({
  id: 'valid_id',
  name: 'valid_name',
  gender: 'N',
  email: 'valid_id',
  password: 'valid_password',
})

// fake custom requests for different behaviors
// if only parameter was provided, it'll be removed
// however, if the parameter was provided with a value,
// request.body will be updated
const makeFakeCustomRequest = (
  parameter: string,
  value?: string,
): IHttpRequest => {
  const request: IHttpRequest = makeFakeValidRequest()

  if (value) {
    request.body[parameter] = value
    return request
  }

  delete request.body[parameter]
  return request
}

// it'll be used for generic errors.
// Example: MongoDB library throws, is an error unknown
const makeFakeGenericError = (stack?: string): Error => {
  const error = new Error()
  if (stack) error.stack = stack
  return error
}

// CheckEmailAdapter, it'll be called when email is valid and
// will be checked if the email is being used
const makeCheckEmailStub = (): ICheckEmail => {
  class CheckEmailStub implements ICheckEmail {
    async check(email: string): Promise<boolean> {
      return Promise.resolve(false)
    }
  }
  return new CheckEmailStub()
}

// EmailValidatorAdapter, user's email will be validated
// and it'll returned a boolean response
const makeEmailValidatorStub = (): IEmailValidator => {
  class EmailValidatorStub implements IEmailValidator {
    isValid(email: string): boolean {
      return true
    }
  }
  return new EmailValidatorStub()
}

// AddAccountAdapter, create an account and return it
const makeAddAccountStub = (): IAddAccount => {
  class AddAccountStub implements IAddAccount {
    async add(newAccountData: INewAccountData): Promise<IAccountEntitie> {
      return Promise.resolve({
        id: 'valid_id',
        name: 'valid_name',
        gender: 'N',
        email: 'valid_id',
        password: 'valid_password',
      })
    }
  }
  return new AddAccountStub()
}

// SUT, our SignUpController object with its dependencies
interface ISut {
  sut: IController
  emailValidator: IEmailValidator
  checkEmail: ICheckEmail
  addAccount: IAddAccount
}

const makeSut = (): ISut => {
  const emailValidator = makeEmailValidatorStub()
  const checkEmail = makeCheckEmailStub()
  const addAccount = makeAddAccountStub()
  const sut = new SignUpController(emailValidator, checkEmail, addAccount)
  return {
    sut,
    emailValidator,
    checkEmail,
    addAccount,
  }
}

describe('SignUpController', () => {
  // return 400 if name wasn't provided
  it('should return a 400 error code if no name is provided', async () => {
    const { sut } = makeSut()

    const httpResponse: IHttpResponse = await sut.perform(
      makeFakeCustomRequest('name'),
    )

    expect(httpResponse).toEqual(badRequest(400, new MissingParamError('name')))
  })

  // return 400 if gender wasn't provided
  it('should return a 400 error code if no gender is provided', async () => {
    const { sut }: ISut = makeSut()

    const httpResponse: IHttpResponse = await sut.perform(
      makeFakeCustomRequest('gender'),
    )

    expect(httpResponse).toEqual(
      badRequest(400, new MissingParamError('gender')),
    )
  })

  // return 400 if email wasn't provided
  it('should return a 400 error code if no email is provided', async () => {
    const { sut }: ISut = makeSut()

    const httpResponse: IHttpResponse = await sut.perform(
      makeFakeCustomRequest('email'),
    )

    expect(httpResponse).toEqual(
      badRequest(400, new MissingParamError('email')),
    )
  })

  // return 400 if password wasn't provided
  it('should return a 400 error code if no password is provided', async () => {
    const { sut }: ISut = makeSut()

    const httpResponse: IHttpResponse = await sut.perform(
      makeFakeCustomRequest('password'),
    )

    expect(httpResponse).toEqual(
      badRequest(400, new MissingParamError('password')),
    )
  })

  // return 400 if password confirmation wasn't provided
  it('should return a 400 error code if no password confirmation is provided', async () => {
    const { sut }: ISut = makeSut()

    const httpResponse: IHttpResponse = await sut.perform(
      makeFakeCustomRequest('passwordConfirmation'),
    )

    expect(httpResponse).toEqual(
      badRequest(400, new MissingParamError('passwordConfirmation')),
    )
  })

  // return 422 if invalid gender is provided
  it('should return a 422 error code if invalid gender is provided', async () => {
    const { sut }: ISut = makeSut()

    const httpResponse: IHttpResponse = await sut.perform(
      makeFakeCustomRequest('gender', 'invalid_gender'),
    )

    expect(httpResponse).toEqual(
      badRequest(422, new InvalidParamError('gender')),
    )
  })

  // return 422 if no passwords match
  it('should return a 422 error code if no passwords match', async () => {
    const { sut }: ISut = makeSut()

    const httpResponse: IHttpResponse = await sut.perform(
      makeFakeCustomRequest('passwordConfirmation', 'different_password'),
    )

    expect(httpResponse).toEqual(
      badRequest(422, new InvalidParamError('passwordConfirmation')),
    )
  })

  // return 422 if password length less than 8 caracters
  it('should return a 422 error code if password length less than 8 caracters', async () => {
    const { sut }: ISut = makeSut()
    const httpRequest: IHttpRequest = makeFakeValidRequest()
    httpRequest.body.password = 'short'
    httpRequest.body.passwordConfirmation = 'short'

    const httpResponse: IHttpResponse = await sut.perform(httpRequest)

    expect(httpResponse).toEqual(
      badRequest(
        422,
        new InvalidParamError("Password can't be less than 8 caracters"),
      ),
    )
  })

  // calls EmailValidator with correct values
  it('should calls Email Validator with correct values', async () => {
    const { sut, emailValidator } = makeSut()
    const isValid = jest.spyOn(emailValidator, 'isValid')

    await sut.perform(makeFakeValidRequest())

    expect(isValid).toHaveBeenCalledWith('any_email')
  })

  // return 500 if EmailValidator throws
  it('should return a 500 error code if EmailValidator throws', async () => {
    const { sut, emailValidator }: ISut = makeSut()
    jest.spyOn(emailValidator, 'isValid').mockImplementationOnce(() => {
      throw new Error()
    })

    const httpResponse: IHttpResponse = await sut.perform(
      makeFakeValidRequest(),
    )

    expect(httpResponse).toEqual(
      serverError(500, makeFakeGenericError('generic EmailValidator error')),
    )
  })

  // return 422 if invalid email is provided
  it('should return a 422 error code if invalid email is provided', async () => {
    const { sut, emailValidator }: ISut = makeSut()

    jest.spyOn(emailValidator, 'isValid').mockReturnValueOnce(false)

    const httpResponse = await sut.perform(makeFakeValidRequest())

    expect(httpResponse).toEqual(
      badRequest(422, new InvalidParamError('email')),
    )
  })

  // call CheckEmail with correct values
  it('should call CheckEmail with correct values', async () => {
    const { sut, checkEmail }: ISut = makeSut()
    const checkSpy = jest.spyOn(checkEmail, 'check')

    await sut.perform(makeFakeValidRequest())

    expect(checkSpy).toHaveBeenCalledWith('any_email')
  })

  // return 500 if CheckEmail throws
  it('should return a 500 error code if CheckEmail throws', async () => {
    const { sut, checkEmail }: ISut = makeSut()
    jest.spyOn(checkEmail, 'check').mockImplementationOnce(() => {
      return Promise.reject(new Error())
    })

    const httpResponse: IHttpResponse = await sut.perform(
      makeFakeValidRequest(),
    )

    expect(httpResponse).toEqual(
      serverError(500, makeFakeGenericError('generic CheckEmail error')),
    )
  })

  // return a 400 if the email already exists
  it('should return a 400 error code if the Email already exists', async () => {
    const { sut, checkEmail }: ISut = makeSut()
    jest.spyOn(checkEmail, 'check').mockReturnValueOnce(Promise.resolve(true))

    const httpResponse: IHttpResponse = await sut.perform(
      makeFakeValidRequest(),
    )

    expect(httpResponse).toEqual(
      badRequest(400, new ParamAlreadyExistsError('email')),
    )
  })

  // call AddAccount with correct values
  it('should call AddAccount with correct values', async () => {
    const { sut, addAccount }: ISut = makeSut()
    const addSpy = jest.spyOn(addAccount, 'add')

    // this is same example, without passwordConfirmation
    const validatedParams = makeFakeValidRequest().body
    delete validatedParams.passwordConfirmation

    await sut.perform(makeFakeValidRequest())

    expect(addSpy).toHaveBeenCalledWith(validatedParams)
  })

  // return 500 if AddAccount throws
  it('should return a 500 error code if AddAccount throws', async () => {
    const { sut, addAccount }: ISut = makeSut()
    jest.spyOn(addAccount, 'add').mockImplementationOnce(() => {
      return Promise.reject(new Error())
    })

    const httpResponse: IHttpResponse = await sut.perform(
      makeFakeValidRequest(),
    )

    expect(httpResponse).toEqual(
      serverError(500, makeFakeGenericError('generic AddAccount error')),
    )
  })

  // return 201 and an account on success
  it('should return a 201 success code and an account on success', async () => {
    const { sut }: ISut = makeSut()

    const httpResponse: IHttpResponse = await sut.perform(
      makeFakeValidRequest(),
    )

    expect(httpResponse.statusCode).toBe(201)
    expect(httpResponse.body).toEqual(makeFakeValidResponse())
  })
})
