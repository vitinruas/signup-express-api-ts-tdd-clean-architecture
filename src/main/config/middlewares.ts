import { Express } from 'express'
import { jsonMiddleware } from '../middlewares/body-parser-middleware'
import { corsMiddleware } from '../middlewares/cors.middleware'
import { contentTypeMiddleware } from '../middlewares/content-type-middleware'

export default (app: Express) => {
  app.use(jsonMiddleware)
  app.use(corsMiddleware)
  app.use(contentTypeMiddleware)
}
