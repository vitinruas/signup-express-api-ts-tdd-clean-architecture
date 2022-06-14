import { badRequest, ok } from '../helpers/http-helper'
import { IHttpRequest, IHttpResponse } from '../protocols/http-protocol'

export class SignUpController {
  perform(httpRequest: IHttpRequest): IHttpResponse {
    const requiredFields = [
      'name',
      'gender',
      'email',
      'password',
      'passwordConfirmation',
    ]

    for (const field of requiredFields) {
      if (!httpRequest.body[field]) {
        return badRequest(400, new Error(`Missing param: ${field}`))
      }
    }
    return ok(201, 'Successful')
  }
}
