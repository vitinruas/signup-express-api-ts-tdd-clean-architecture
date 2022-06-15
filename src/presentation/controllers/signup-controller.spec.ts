import { IAccountEntitie } from '../../domain/entities/account-entitie'
import {
  IAddAccount,
  INewAccountData,
} from '../../domain/usecase/add-account-usecase'
import { InvalidParamError, MissingParamError, ServerError } from '../errors'
import { IController, IEmailValidator } from './signup-controller-protocols'
import { SignUpController } from './signup-controller'

interface ISut {
  sut: IController
  emailValidator: IEmailValidator
  addAccount: IAddAccount
}

const makeEmailValidatorStub = (): IEmailValidator => {
  class EmailValidatorStub implements IEmailValidator {
    isValid(email: string): boolean {
      return true
    }
  }
  return new EmailValidatorStub()
}

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

const makeSut = (): ISut => {
  const emailValidator = makeEmailValidatorStub()
  const addAccount = makeAddAccountStub()
  const sut = new SignUpController(emailValidator, addAccount)
  return {
    sut,
    emailValidator,
    addAccount,
  }
}

describe('SignUpController', () => {
  // return 400 if name wasn't provided
  it('should return a 400 error code if no name is provided', async () => {
    const { sut } = makeSut()

    const httpRequest = {
      body: {
        gender: 'N',
        email: 'any_email',
        password: 'any_password',
        passwordConfirmation: 'any_password',
      },
    }
    const httpResponse = await sut.perform(httpRequest)

    expect(httpResponse.statusCode).toBe(400)
    expect(httpResponse.body).toEqual(new MissingParamError('name'))
  })
  // return 400 if gender wasn't provided
  it('should return a 400 error code if no gender is provided', async () => {
    const { sut } = makeSut()

    const httpRequest = {
      body: {
        name: 'any_name',
        email: 'any_email',
        password: 'any_password',
        passwordConfirmation: 'any_password',
      },
    }
    const httpResponse = await sut.perform(httpRequest)

    expect(httpResponse.statusCode).toBe(400)
    expect(httpResponse.body).toEqual(new MissingParamError('gender'))
  })
  // return 400 if email wasn't provided
  it('should return a 400 error code if no email is provided', async () => {
    const { sut } = makeSut()

    const httpRequest = {
      body: {
        name: 'any_name',
        gender: 'N',
        password: 'any_password',
        passwordConfirmation: 'any_password',
      },
    }
    const httpResponse = await sut.perform(httpRequest)

    expect(httpResponse.statusCode).toBe(400)
    expect(httpResponse.body).toEqual(new MissingParamError('email'))
  })
  // return 400 if password wasn't provided
  it('should return a 400 error code if no password is provided', async () => {
    const { sut } = makeSut()

    const httpRequest = {
      body: {
        name: 'any_name',
        gender: 'N',
        email: 'any_email',
        passwordConfirmation: 'any_password',
      },
    }
    const httpResponse = await sut.perform(httpRequest)

    expect(httpResponse.statusCode).toBe(400)
    expect(httpResponse.body).toEqual(new MissingParamError('password'))
  })
  // return 400 if password confirmation wasn't provided
  it('should return a 400 error code if no password confirmation is provided', async () => {
    const { sut } = makeSut()

    const httpRequest = {
      body: {
        name: 'any_name',
        gender: 'N',
        email: 'any_email',
        password: 'any_password',
      },
    }
    const httpResponse = await sut.perform(httpRequest)

    expect(httpResponse.statusCode).toBe(400)
    expect(httpResponse.body).toEqual(
      new MissingParamError('passwordConfirmation'),
    )
  })
  // return 422 if invalid gender is provided
  it('should return a 422 error code if invalid gender is provided', async () => {
    const { sut } = makeSut()

    const httpRequest = {
      body: {
        name: 'any_name',
        gender: 'invalid_gender',
        email: 'any_email',
        password: 'any_password',
        passwordConfirmation: 'any_password',
      },
    }
    const httpResponse = await sut.perform(httpRequest)

    expect(httpResponse.statusCode).toBe(422)
    expect(httpResponse.body).toEqual(new InvalidParamError('gender'))
  })
  // return 422 if no passwords match
  it('should return a 422 error code if no passwords match', async () => {
    const { sut } = makeSut()

    const httpRequest = {
      body: {
        name: 'any_name',
        gender: 'N',
        email: 'any_email',
        password: 'diff_password_1',
        passwordConfirmation: 'diff_password_2',
      },
    }
    const httpResponse = await sut.perform(httpRequest)

    expect(httpResponse.statusCode).toBe(422)
    expect(httpResponse.body).toEqual(
      new InvalidParamError('passwordConfirmation'),
    )
  })
  // return 422 if invalid email is provided
  it('should return a 422 error code if invalid email is provided', async () => {
    const { sut, emailValidator } = makeSut()

    jest.spyOn(emailValidator, 'isValid').mockReturnValueOnce(false)

    const httpRequest = {
      body: {
        name: 'any_name',
        gender: 'N',
        email: 'invalid_email',
        password: 'any_password',
        passwordConfirmation: 'any_password',
      },
    }
    const httpResponse = await sut.perform(httpRequest)

    expect(httpResponse.statusCode).toBe(422)
    expect(httpResponse.body).toEqual(new InvalidParamError('email'))
  })
  // return 500 if Email Validator throws
  it('should return a 500 error code if Email Validator throws', async () => {
    const { sut, emailValidator } = makeSut()

    jest.spyOn(emailValidator, 'isValid').mockImplementationOnce(() => {
      throw new Error()
    })

    const httpRequest = {
      body: {
        name: 'any_name',
        gender: 'N',
        email: 'any_email',
        password: 'any_password',
        passwordConfirmation: 'any_password',
      },
    }
    const httpResponse = await sut.perform(httpRequest)

    expect(httpResponse.statusCode).toBe(500)
    expect(httpResponse.body).toEqual(new ServerError())
  })
  // calls Email Validator with correct values
  it('should return a 201 success code and calls Email Validator with correct values', async () => {
    const { sut, emailValidator } = makeSut()

    const isValid = jest.spyOn(emailValidator, 'isValid')

    const httpRequest = {
      body: {
        name: 'any_name',
        gender: 'N',
        email: 'any_email',
        password: 'any_password',
        passwordConfirmation: 'any_password',
      },
    }
    await sut.perform(httpRequest)

    expect(isValid).toHaveBeenCalledWith('any_email')
  })
  // return 500 if Add Account throws
  it('should return a 500 error code if Add Account throws', async () => {
    const { sut, addAccount } = makeSut()

    jest.spyOn(addAccount, 'add').mockImplementationOnce(() => {
      return Promise.reject(new Error())
    })

    const httpRequest = {
      body: {
        name: 'any_name',
        gender: 'N',
        email: 'any_email',
        password: 'any_password',
        passwordConfirmation: 'any_password',
      },
    }
    const httpResponse = await sut.perform(httpRequest)

    expect(httpResponse.statusCode).toBe(500)
  })
  // calls Add Account with correct values
  it('should calls Add Account with correct values', async () => {
    const { sut, addAccount } = makeSut()

    const addSpy = jest.spyOn(addAccount, 'add')

    const httpRequest = {
      body: {
        name: 'any_name',
        gender: 'N',
        email: 'any_email',
        password: 'any_password',
        passwordConfirmation: 'any_password',
      },
    }
    await sut.perform(httpRequest)

    expect(addSpy).toHaveBeenCalledWith({
      name: 'any_name',
      gender: 'N',
      email: 'any_email',
      password: 'any_password',
    })
  })
  // return 201 and an account on success
  it('should return a 201 success code and an account on success', async () => {
    const { sut } = makeSut()
    const httpRequest = {
      body: {
        name: 'any_name',
        gender: 'N',
        email: 'any_email',
        password: 'any_password',
        passwordConfirmation: 'any_password',
      },
    }
    const httpResponse = await sut.perform(httpRequest)

    expect(httpResponse.statusCode).toBe(201)
    expect(httpResponse.body).toEqual({
      id: 'valid_id',
      name: 'valid_name',
      gender: 'N',
      email: 'valid_id',
      password: 'valid_password',
    })
  })
})
