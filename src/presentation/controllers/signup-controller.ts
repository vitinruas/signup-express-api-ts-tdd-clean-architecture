import { badRequest, ok } from '../helpers/http-helper'
import { IHttpRequest, IHttpResponse } from '../protocols/http-protocol'

export class SignUpController {
  perform(httpRequest: IHttpRequest): IHttpResponse {
    if (!httpRequest.body.name) {
      return badRequest(400, new Error('Missing param: name'))
    }
    if (!httpRequest.body.gender) {
      return badRequest(400, new Error('Missing param: gender'))
    }
    if (!httpRequest.body.email) {
      return badRequest(400, new Error('Missing param: email'))
    }
    if (!httpRequest.body.password) {
      return badRequest(400, new Error('Missing param: password'))
    }
    if (!httpRequest.body.passwordConfirmation) {
      return badRequest(400, new Error('Missing param: password confirmation'))
    }
    return ok(201, 'Successful')
  }
}
