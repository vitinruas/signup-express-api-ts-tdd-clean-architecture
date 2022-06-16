import { mongoHelper } from '../../helpers/mongoHelper'
import { FindEmailRepository } from '../find-email-repository'
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

const makeSut = (): IFindEmailRepository => new FindEmailRepository()
const makeUserAccount = (): void => {
  const colletionRef = mongoHelper.getCollection('accounts')
  colletionRef.insertOne({
    name: 'pietro',
    email: 'any_email@mail.com',
  })
}

describe('FindEmailRepository', () => {
  it('should find email and return if it exists', async () => {
    const sut = makeSut()
    makeUserAccount()

    const emailToVerify = 'any_email@mail.com'

    const response = await sut.find(emailToVerify)

    expect(response).toBeTruthy()
  })
})
