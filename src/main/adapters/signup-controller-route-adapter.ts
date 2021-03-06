import { Request, Response } from 'express'
import {
  IController,
  IHttpRequest,
  IHttpResponse,
} from '../../presentation/protocols'

export const adapterExpressToController = (controller: IController) => {
  return async (request: Request, response: Response) => {
    const httpRequest: IHttpRequest = {
      body: request.body,
    }

    const httpResponse: IHttpResponse = await controller.perform(httpRequest)
    if (httpResponse.statusCode >= 400) {
      return response
        .status(httpResponse.statusCode)
        .json(httpResponse.body.message)
        .send()
    }
    return response
      .status(httpResponse.statusCode)
      .json(httpResponse.body)
      .send()
  }
}
