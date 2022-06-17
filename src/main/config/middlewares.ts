import { Express } from 'express'
import {
  jsonMiddleware,
  corsMiddleware,
  contentTypeMiddleware,
} from '../middlewares/'

export default (app: Express) => {
  app.use(jsonMiddleware)
  app.use(corsMiddleware)
  app.use(contentTypeMiddleware)
}
