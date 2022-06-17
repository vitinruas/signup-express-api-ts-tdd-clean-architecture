import { mongoHelper } from '../infra/repository/db/mongo/helpers/mongoHelper'
import app from './config/app'
import env from './config/env'

mongoHelper
  .connect(env.mongoUrl)
  .then(() => {
    app.listen(env.port, () => {
      console.log('Server running at http://localhost/')
    })
  })
  .catch((err) => console.log(err))
