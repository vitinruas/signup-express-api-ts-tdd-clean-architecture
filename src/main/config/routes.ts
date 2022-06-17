import FastGlob from 'fast-glob'
import { Express, Router } from 'express'

export default (app: Express) => {
  const router = Router()
  app.use('/api', router)
  FastGlob.sync('**/src/main/routes/**route.ts').map(async (file) =>
    (await import(`../../../${file}`)).default(app),
  )
}
