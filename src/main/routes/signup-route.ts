import { Request, Response, Router } from 'express'

export default (router: Router) => {
  router.post('/signup', (request: Request, response: Response) => {
    return response.status(200).json({}).send()
  })
}
