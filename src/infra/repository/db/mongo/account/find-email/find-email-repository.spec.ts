import { mongoHelper } from '../../helpers/mongoHelper'
import { MongoMemoryServer } from 'mongodb-memory-server'
import { FindEmailMongoRepository } from './find-email-repository'
import {
  IFindEmailRepository,
  INewAccountData,
} from './find-email-repository-protocols'

// this email will be used for verify if there is an account already used it
const makeFakeValidEmail = (): string => 'any_email@mail.com'

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

const makeSut = (): IFindEmailRepository => new FindEmailMongoRepository()
const makeFakeUserAccount = async (): Promise<void> => {
  const colletionRef = mongoHelper.getCollection('accounts')
  await colletionRef.insertOne(makeFakeNewAccountData())
}

type FindEmailRepositoryResultType = string | undefined

describe('FindEmailRepository', () => {
  // return email if there is an account associated with it
  test('should find email and return if it exists', async () => {
    const sut: IFindEmailRepository = makeSut()
    await makeFakeUserAccount()

    const response: FindEmailRepositoryResultType = await sut.find(
      makeFakeValidEmail(),
    )

    expect(response).toBeTruthy()
  })

  // return undefined if there is no account associated with it
  test("should return undefined if an account associated with a provided email doesn't exist  ", async () => {
    const sut: IFindEmailRepository = makeSut()

    const response: FindEmailRepositoryResultType = await sut.find(
      makeFakeValidEmail(),
    )

    expect(response).toBe(undefined)
  })
})
