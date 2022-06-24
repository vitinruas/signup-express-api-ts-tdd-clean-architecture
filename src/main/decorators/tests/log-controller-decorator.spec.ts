import { mongoHelper } from '../../../infra/repository/db/mongo/helpers/mongoHelper'
import { MongoMemoryServer } from 'mongodb-memory-server'
import { LogControllerDecorator } from '../log-controller-decorator'
import {
  IController,
  ILogRepository,
  IHttpRequest,
  IHttpResponse,
} from '../log-controller-decorator-protocols'

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

const makeFakeValidRequest = (): IHttpRequest => ({
  body: {},
})

const makeFakeSuccessResponse = (): IHttpResponse => ({
  statusCode: 200,
  body: null,
})

const makeControllerStub = (): IController => {
  class ControllerStub implements IController {
    async perform(httpRequest: IHttpRequest): Promise<IHttpResponse> {
      return Promise.resolve(makeFakeSuccessResponse())
    }
  }

  return new ControllerStub()
}

const makeLogRepository = (): ILogRepository => {
  class LogRepository implements ILogRepository {
    async logServerError(stack: string): Promise<void> {
      return Promise.resolve()
    }
  }
  return new LogRepository()
}

describe('LogControllerDecorator', () => {
  // call Controller.perform with correct values
  test('should call Controller.perform with correct values', async () => {
    const controllerStub = makeControllerStub()
    const logRepositoryStub = makeLogRepository()
    const sut = new LogControllerDecorator(controllerStub, logRepositoryStub)

    const performSpy = jest.spyOn(controllerStub, 'perform')

    await sut.perform(makeFakeValidRequest())
    expect(performSpy).toHaveBeenCalledWith(makeFakeValidRequest())
  })
})
