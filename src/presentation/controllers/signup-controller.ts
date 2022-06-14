import { badRequest, ok } from '../helpers/http-helper'
import { IHttpRequest, IHttpResponse } from '../protocols/http-protocol'

export class SignUpController {
  perform(httpRequest: IHttpRequest): IHttpResponse {
    if (!httpRequest.body.name) {
      return badRequest(400, new Error('Missing param: name'))
    }
    return ok(201, 'Successful')
  }
}
