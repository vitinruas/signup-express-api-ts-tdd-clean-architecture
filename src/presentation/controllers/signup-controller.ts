import { InvalidParamError } from '../errors/invalid-param-error'
import { MissingParamError } from '../errors/missing-param-error'
import { badRequest, ok } from '../helpers/http-helper'
import { IController } from '../protocols/controller-protocol'
import { IEmailValidator } from '../protocols/email-validator-protocol'
import { IHttpRequest, IHttpResponse } from '../protocols/http-protocol'

export class SignUpController implements IController {
  private readonly emailValidator: IEmailValidator
  constructor(emailValidator: IEmailValidator) {
    this.emailValidator = emailValidator
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
    // check if passwords match
    if (httpRequest.body.password !== httpRequest.body.passwordConfirmation) {
      return badRequest(422, new InvalidParamError('passwordConfirmation'))
    }
    try {
      const isValid = this.emailValidator.isValid(httpRequest.body.email)
      if (!isValid) {
        return badRequest(422, new InvalidParamError('email'))
      }
      return ok(201, 'Successful')
    } catch (error) {
      return badRequest(500, new Error('Unexpected Internal Error 500'))
    }
  }
}
