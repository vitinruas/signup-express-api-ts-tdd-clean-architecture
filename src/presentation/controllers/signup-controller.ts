import { IHttpRequest, IHttpResponse } from '../protocols/http-protocol'

export class SignUpController {
  perform(httpRequest: IHttpRequest): IHttpResponse {
    if (!httpRequest.body.name) {
      return {
        statusCode: 400,
        body: 'Missing param: name',
      }
    }
    return {
      statusCode: 201,
      body: 'Successful',
    }
  }
}
