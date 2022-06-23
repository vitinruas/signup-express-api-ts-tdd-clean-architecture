import { InvalidParamError, MissingParamError } from '../errors'
import { badRequest, ok, serverError } from '../helpers/http-helper'
import {
  IController,
  IEmailValidator,
  ICheckEmail,
  IAddAccount,
  IHttpRequest,
  IHttpResponse,
  IAccountEntitie,
} from './signup-controller-protocols'
import { ParamAlreadyExistsError } from '../errors/param-exists-error'

export class SignUpController implements IController {
  private readonly emailValidator: IEmailValidator
  private readonly checkEmail: ICheckEmail
  private readonly addAccount: IAddAccount

  constructor(
    emailValidator: IEmailValidator,
    checkEmail: ICheckEmail,
    addAccount: IAddAccount,
  ) {
    this.emailValidator = emailValidator
    this.checkEmail = checkEmail
    this.addAccount = addAccount
  }

  async perform(httpRequest: IHttpRequest): Promise<IHttpResponse> {
    // check if all required fields were provided to controller
    const requiredFields: ReadonlyArray<string> = [
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
    const listGender: ReadonlyArray<string> = ['M', 'F', 'O', 'N']
    if (!listGender.includes(gender)) {
      return badRequest(422, new InvalidParamError('gender'))
    }

    // check if passwords match
    if (password !== passwordConfirmation) {
      return badRequest(422, new InvalidParamError('passwordConfirmation'))
    }

    // check if password is more or equal than 8 caracters
    if (password.length < 8) {
      return badRequest(
        422,
        new InvalidParamError("Password can't be less than 8 caracters"),
      )
    }

    try {
      // check if the email is valid
      const isValid: boolean = this.emailValidator.isValid(email)
      if (!isValid) {
        return badRequest(422, new InvalidParamError('email'))
      }

      // check if the provided email already exists
      const alreadyExists: boolean = await this.checkEmail.check(email)
      if (alreadyExists) {
        return badRequest(400, new ParamAlreadyExistsError('email'))
      }

      // create a new account and return it
      const createdAccount: IAccountEntitie = await this.addAccount.add({
        name,
        gender,
        email,
        password,
      })
      return ok(201, createdAccount)
    } catch (error: any) {
      return serverError(500, error)
    }
  }
}
