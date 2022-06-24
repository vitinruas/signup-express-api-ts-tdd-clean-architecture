import { mongoHelper } from '../../helpers/mongoHelper'
import { MongoMemoryServer } from 'mongodb-memory-server'
import { LogControllerMongoRepository } from './log-controller-repository'
import { ILogRepository } from '../../../../../../main/decorators/log-controller-decorator-protocols'

// fake connection
beforeAll(async () => {
  const mongoMemoryServer = await MongoMemoryServer.create()
  const uri: string = mongoMemoryServer.getUri()
  await mongoHelper.connect(uri)
})

afterAll(async () => {
  await mongoHelper.disconnect()
})

afterEach(async () => {
  const collectionRef = mongoHelper.getCollection('serverErrors')
  await collectionRef.deleteMany({})
})

const makeSut = (): ILogRepository => new LogControllerMongoRepository()

describe('LogControllerRepository', () => {
  // add a log ocurrency to database
  test('should add a log ocurrency to database', async () => {
    const sut = makeSut()
    const collectionRef = mongoHelper.getCollection('serverErrors')

    await sut.logServerError('any_error')
    const qtyDocuments = await collectionRef.countDocuments()

    expect(qtyDocuments).toBe(1)
  })
})
