import { mongoHelper } from '../../helpers/mongoHelper'
import { FindEmailMongoRepository } from '../find-email-repository'
import { MongoMemoryServer } from 'mongodb-memory-server'
import { IFindEmailRepository } from '../../../../../../data/protocols/check-email/find-email-repository-protocol'

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

const makeSut = (): IFindEmailRepository => new FindEmailMongoRepository()
const makeUserAccount = (): void => {
  const colletionRef = mongoHelper.getCollection('accounts')
  colletionRef.insertOne({
    name: 'pietro',
    email: 'any_email@mail.com',
  })
}

describe('FindEmailRepository', () => {
  test('should find email and return if it exists', async () => {
    const sut = makeSut()
    makeUserAccount()

    const emailToVerify = 'any_email@mail.com'

    const response = await sut.find(emailToVerify)

    expect(response).toBeTruthy()
  })
  test("should return undefined if an account associated with a provided email doesn't exist  ", async () => {
    const sut = makeSut()

    const emailToVerify = 'any_email@mail.com'

    const response = await sut.find(emailToVerify)

    expect(response).toBe(undefined)
  })
})
