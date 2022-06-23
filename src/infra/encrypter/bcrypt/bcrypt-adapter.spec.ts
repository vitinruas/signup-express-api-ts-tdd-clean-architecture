import bcrypt from 'bcrypt'
import { IEncrypter } from '../../../data/protocols/add-account/encrypter-protocol'
import { BcryptAdapter } from './bcrypt-adapter'

const makeFakeValidPassword = (): string => 'any_password'
const makeFakeHashedPassword = (): string => 'hashed_password'

jest.mock('bcrypt', () => ({
  async hash(password: string): Promise<string> {
    return Promise.resolve(makeFakeHashedPassword())
  },
}))

const makeSut = (salt: number = 12): IEncrypter => new BcryptAdapter(salt)

describe('BcryptAdapter', () => {
  // call Bcrypt with correct values
  it('should call Bcrypt with correct values', async () => {
    const sut: IEncrypter = makeSut()
    const hashSpy = jest.spyOn(bcrypt, 'hash')

    await sut.encrypt(makeFakeValidPassword())

    expect(hashSpy).toHaveBeenCalledWith(makeFakeValidPassword(), 12)
  })

  // return throw if Bcrypt throws
  it('should return throw if Bcrypt throws', async () => {
    const sut: IEncrypter = makeSut()
    jest.spyOn(bcrypt, 'hash').mockImplementationOnce(() => {
      return Promise.reject(new Error())
    })

    const response: Promise<string> = sut.encrypt(makeFakeValidPassword())

    await expect(response).rejects.toThrow()
  })

  // return a hashed password
  it('should return a hashed password', async () => {
    const sut: IEncrypter = makeSut()
    const response: string = await sut.encrypt(makeFakeValidPassword())

    expect(response).toBe(makeFakeHashedPassword())
  })
})
