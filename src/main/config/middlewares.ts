import { Express } from 'express'
import json from '../middlewares/body-parser-middleware'

export default (app: Express) => {
  app.use(json)
}
