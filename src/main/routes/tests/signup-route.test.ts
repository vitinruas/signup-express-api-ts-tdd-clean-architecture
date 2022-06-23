import request from 'supertest'
import app from '../../config/app'

import { mongoHelper } from '../../../infra/repository/db/mongo/helpers/mongoHelper'
import { MongoMemoryServer } from 'mongodb-memory-server'

beforeAll(async () => {
  const mongoMemoryServer = await MongoMemoryServer.create()
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

describe('SignUp Router', () => {
  // should return 200 and the new created account
  test('should return a 200 success code and the new created account', async () => {
    await request(app)
      .post('/signup')
      .send({
        name: 'any_name',
        gender: 'N',
        email: 'any_email@mail.com',
        password: 'any_password',
        passwordConfirmation: 'any_password',
      })
      .expect(201)
  })
})
