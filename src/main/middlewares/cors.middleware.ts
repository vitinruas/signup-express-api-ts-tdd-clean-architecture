import { NextFunction, Request, Response } from 'express'

export const corsMiddleware = (
  request: Request,
  response: Response,
  next: NextFunction,
) => {
  response.set('access-controll-allow-headers', '*')
  response.set('access-controll-allow-origin', '*')
  response.set('access-controll-allow-methods', '*')
  return next()
}
