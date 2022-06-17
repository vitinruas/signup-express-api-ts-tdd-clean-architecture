import { mongoHelper } from '../../helpers/mongoHelper'
import { MongoMemoryServer } from 'mongodb-memory-server'
import { AddAccountMongoRepository } from '../add-account-repository'
import { INewAccountData } from '../../../../../../domain/usecase/add-account-usecase'

let mongoMemoryServer: MongoMemoryServer

beforeAll(async () => {
  mongoMemoryServer = await MongoMemoryServer.create()
  const uri = mongoMemoryServer.getUri()
  await mongoHelper.connect(uri)
})

afterAll(async () => {
  await mongoHelper.disconnect()
})

afterEach(async () => {
  const collectionRef = mongoHelper.getCollection('accounts')
  await collectionRef.deleteMany({})
})

describe('AddAccountMongoRepo', () => {
  test('should return an account on success', async () => {
    const sut = new AddAccountMongoRepository()

    const newAccounData: INewAccountData = {
      name: 'any_name',
      email: 'any_email@mail.com',
      gender: 'N',
      password: 'hashed_password',
    }

    const response = await sut.add(newAccounData)

    expect(response).toBeTruthy()
    expect(response.id).toBeTruthy()
    expect(response.gender).toBe('N')
    expect(response.name).toBe('any_name')
    expect(response.email).toBe('any_email@mail.com')
    expect(response.password).toBe('hashed_password')
  })
})
