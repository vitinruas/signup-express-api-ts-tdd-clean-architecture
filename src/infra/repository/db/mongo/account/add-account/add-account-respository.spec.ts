import { mongoHelper } from '../../helpers/mongoHelper'
import { MongoMemoryServer } from 'mongodb-memory-server'
import { AddAccountMongoRepository } from './add-account-repository'
import {
  IAddAccountRepository,
  INewAccountData,
  IAccountEntitie,
} from './add-account-repository-protocols'

// this data come from AddAccountAdapter
const makeFakeNewAccountData = (
  withCriptography: boolean = false,
): INewAccountData => {
  const newAccountData: INewAccountData = {
    name: 'any_name',
    gender: 'N',
    email: 'any_email@mail.com',
    password: 'hashed_password',
  }
  return newAccountData
}

let mongoMemoryServer: MongoMemoryServer

beforeAll(async () => {
  mongoMemoryServer = await MongoMemoryServer.create()
  const uri: string = mongoMemoryServer.getUri()
  await mongoHelper.connect(uri)
})

afterAll(async () => {
  await mongoHelper.disconnect()
})

afterEach(async () => {
  const collectionRef = mongoHelper.getCollection('accounts')
  await collectionRef.deleteMany({})
})

const makeSut = (): IAddAccountRepository => new AddAccountMongoRepository()

describe('AddAccountMongoRepository', () => {
  // return an account if it exists
  test('should return an account on success', async () => {
    const sut = makeSut()

    const response: IAccountEntitie = await sut.add(makeFakeNewAccountData())

    expect(response).toBeTruthy()
    expect(response.id).toBeTruthy()
    expect(response.gender).toBe('N')
    expect(response.name).toBe('any_name')
    expect(response.email).toBe('any_email@mail.com')
    expect(response.password).toBe('hashed_password')
  })
})
