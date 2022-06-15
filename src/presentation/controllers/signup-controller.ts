import { IAccountEntitie } from '../../domain/entities/account-entitie'
import { IAddAccount } from '../../domain/usecase/add-account-usecase'
import { InvalidParamError, MissingParamError, ServerError } from '../errors'
import { badRequest, ok } from '../helpers/http-helper'
import {
  IController,
  IEmailValidator,
  IHttpRequest,
  IHttpResponse,
} from './signup-controller-protocols'

export class SignUpController implements IController {
  private readonly emailValidator: IEmailValidator
  private readonly addAccount: IAddAccount
  constructor(emailValidator: IEmailValidator, addAccount: IAddAccount) {
    this.emailValidator = emailValidator
    this.addAccount = addAccount
  }

  perform(httpRequest: IHttpRequest): IHttpResponse {
    // check if all required fields were provided to controller
    const requiredFields = [
      'name',
      'gender',
      'email',
      'password',
      'passwordConfirmation',
    ]
    for (const field of requiredFields) {
      if (!httpRequest.body[field]) {
        return badRequest(400, new MissingParamError(field))
      }
    }

    // check if valid gender was provided
    const listGender = ['M', 'F', 'O', 'N']
    if (!listGender.includes(httpRequest.body.gender)) {
      return badRequest(422, new InvalidParamError('gender'))
    }

    // check if passwords match
    if (httpRequest.body.password !== httpRequest.body.passwordConfirmation) {
      return badRequest(422, new InvalidParamError('passwordConfirmation'))
    }

    try {
      // check if valid email was provided
      const isValid = this.emailValidator.isValid(httpRequest.body.email)
      if (!isValid) {
        return badRequest(422, new InvalidParamError('email'))
      }

      // create a new account and return it
      const createdAccount: IAccountEntitie = this.addAccount.add({
        name: httpRequest.body.name,
        gender: httpRequest.body.gender,
        email: httpRequest.body.email,
        password: httpRequest.body.password,
      })
      return ok(201, createdAccount)
    } catch (error) {
      return badRequest(500, new ServerError())
    }
  }
}
