import { IHttpResponse } from '../protocols/http-protocol'

export const badRequest = (
  statusCode: number,
  error: Error,
): IHttpResponse => ({
  statusCode,
  body: error,
})

export const ok = (statusCode: number, body: any): IHttpResponse => ({
  statusCode,
  body,
})

export const serverError = (statusCode: number, body: any): IHttpResponse => ({
  statusCode,
  body,
})
