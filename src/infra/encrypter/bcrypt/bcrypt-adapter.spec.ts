import { BcryptAdapter } from './bcrypt-adapter'
// eslint-disable-next-line no-unused-vars
import bcrypt from 'bcrypt'

jest.mock('bcrypt', () => ({
  async hash(password: string): Promise<string> {
    return Promise.resolve('hashed_password')
  },
}))

describe('BcryptAdapter', () => {
  it('should calls Bcrypt with correct values', async () => {
    const salt = 12
    const sut = new BcryptAdapter(salt)

    const hashSpy = jest.spyOn(bcrypt, 'hash')

    await sut.encrypt('any_password')

    expect(hashSpy).toHaveBeenCalledWith('any_password', 12)
  })
  it('should return a hashed password', async () => {
    const salt = 12
    const sut = new BcryptAdapter(salt)

    const response = await sut.encrypt('any_password')

    expect(response).toBe('hashed_password')
  })
  it('should returns throw if Bcrypt throws', async () => {
    const salt = 12
    const sut = new BcryptAdapter(salt)

    jest.spyOn(bcrypt, 'hash').mockImplementationOnce(() => {
      return Promise.reject(new Error())
    })

    const response = sut.encrypt('any_password')

    expect(response).rejects.toThrow()
  })
})
