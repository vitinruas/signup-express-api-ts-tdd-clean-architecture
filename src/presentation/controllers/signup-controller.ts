import { InvalidParamError } from '../errors/invalid-param-error'
import { MissingParamError } from '../errors/missing-param-error'
import { badRequest, ok } from '../helpers/http-helper'
import { IHttpRequest, IHttpResponse } from '../protocols/http-protocol'

export class SignUpController {
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
    return ok(201, 'Successful')
  }
}
