import { IAccountEntitie } from '../../domain/entities/account-entitie'
import { IAddAccount } from '../../domain/usecase/add-account-usecase'
import { InvalidParamError, MissingParamError, ServerError } from '../errors'
import { badRequest, ok, serverError } from '../helpers/http-helper'
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

  async perform(httpRequest: IHttpRequest): Promise<IHttpResponse> {
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

    // destructure body
    const { name, gender, email, password, passwordConfirmation } =
      httpRequest.body

    // check if valid gender was provided
    const listGender = ['M', 'F', 'O', 'N']
    if (!listGender.includes(gender)) {
      return badRequest(422, new InvalidParamError('gender'))
    }

    // check if passwords match
    if (password !== passwordConfirmation) {
      return badRequest(422, new InvalidParamError('passwordConfirmation'))
    }

    try {
      // check if the email is valid
      const isValid = this.emailValidator.isValid(email)
      if (!isValid) {
        return badRequest(422, new InvalidParamError('email'))
      }

      // create a new account and return it
      const createdAccount: IAccountEntitie = await this.addAccount.add({
        name,
        gender,
        email,
        password,
      })
      return ok(201, createdAccount)
    } catch (error) {
      return serverError(500, new ServerError())
    }
  }
}
