import { IEmailValidator } from '../../presentation/protocols/email-validator-protocol'
import validator from 'validator'

export class EmailValidatorAdapter implements IEmailValidator {
  isValid(email: string): boolean {
    const isValid: boolean = validator.isEmail(email)
    return isValid
  }
}
