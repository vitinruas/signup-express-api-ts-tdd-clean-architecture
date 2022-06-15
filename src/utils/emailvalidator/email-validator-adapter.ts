import { IEmailValidator } from '../../presentation/protocols/email-validator-protocol'
import validator from 'validator'

export class EmailValidatorAdapter implements IEmailValidator {
  isValid(email: string): Promise<boolean> {
    const isValid = validator.isEmail(email)
    return Promise.resolve(isValid)
  }
}
