import { AddAccountAdapter } from '../../data/usecases/add-account/add-account-adapter'
import { CheckEmailAdapter } from '../../data/usecases/check-email/check-email-adapter'
import { BcryptAdapter } from '../../infra/encrypter/bcrypt/bcrypt-adapter'
import { AddAccountMongoRepository } from '../../infra/repository/db/mongo/account/add-account/add-account-repository'
import { FindEmailMongoRepository } from '../../infra/repository/db/mongo/account/find-email/find-email-repository'
import { SignUpController } from '../../presentation/controllers/signup-controller'
import { EmailValidatorAdapter } from '../../utils/emailvalidator/email-validator-adapter'

// BcryptAdapter and addAccountMongoRepository -> Infra Layer
const bcryptAdapter = new BcryptAdapter(12)
const addAccountRepository = new AddAccountMongoRepository()
const findEmailRepository = new FindEmailMongoRepository()
// CheckEmailAdapter and AddAccountAdapter -> Data Layer
const checkEmailAdapter = new CheckEmailAdapter(findEmailRepository)
const addAccountAdapter = new AddAccountAdapter(
  bcryptAdapter,
  addAccountRepository,
)
// EmailValidatorAdapter -> Utils Layer
const emailValidatorAdapter = new EmailValidatorAdapter()
// SignUpController -> Presentation Layer
const signUpController = new SignUpController(
  emailValidatorAdapter,
  checkEmailAdapter,
  addAccountAdapter,
)

export default signUpController
