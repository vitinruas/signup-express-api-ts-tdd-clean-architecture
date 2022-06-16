import { BcryptAdapter } from './bcrypt-adapter'
// eslint-disable-next-line no-unused-vars
import bcrypt from 'bcrypt'
import { IEncrypter } from '../../../data/protocols/add-account/encrypter-protocol'

jest.mock('bcrypt', () => ({
  async hash(password: string): Promise<string> {
    return Promise.resolve('hashed_password')
  },
}))

const makeSut = (salt: number = 12): IEncrypter => new BcryptAdapter(salt)

describe('BcryptAdapter', () => {
  it('should calls Bcrypt with correct values', async () => {
    const sut = makeSut()

    const hashSpy = jest.spyOn(bcrypt, 'hash')

    await sut.encrypt('any_password')

    expect(hashSpy).toHaveBeenCalledWith('any_password', 12)
  })
  it('should return a hashed password', async () => {
    const sut = makeSut()

    const response = await sut.encrypt('any_password')

    expect(response).toBe('hashed_password')
  })
  it('should returns throw if Bcrypt throws', async () => {
    const sut = makeSut()

    jest.spyOn(bcrypt, 'hash').mockImplementationOnce(() => {
      return Promise.reject(new Error())
    })

    const response = sut.encrypt('any_password')

    expect(response).rejects.toThrow()
  })
})
