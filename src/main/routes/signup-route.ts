import { Router } from 'express'
import { adapterExpressToController } from '../adapters/signup-controller-route-adapter'
import signUpController from '../factories/signup-factory'

export default (router: Router) => {
  router.post('/signup', adapterExpressToController(signUpController))
}
