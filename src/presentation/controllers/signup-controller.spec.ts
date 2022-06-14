import { SignUpController } from './signup-controller'

describe('SignUpController', () => {
  // return 400 if name wasn't provided
  it('should return a 400 error code if no name is provided', () => {
    const sut = new SignUpController()

    const httpRequest = {
      body: {
        gender: 'any_gender',
        email: 'any_email',
        password: 'any_password',
        passwordConfirmation: 'any_password',
      },
    }
    const httpResponse = sut.perform(httpRequest)

    expect(httpResponse.statusCode).toBe(400)
    expect(httpResponse.body).toEqual(new Error('Missing param: name'))
  })
  // return 400 if gender wasn't provided
  it('should return a 400 error code if no gender is provided', () => {
    const sut = new SignUpController()

    const httpRequest = {
      body: {
        name: 'any_name',
        email: 'any_email',
        password: 'any_password',
        passwordConfirmation: 'any_password',
      },
    }
    const httpResponse = sut.perform(httpRequest)

    expect(httpResponse.statusCode).toBe(400)
    expect(httpResponse.body).toEqual(new Error('Missing param: gender'))
  })
})
