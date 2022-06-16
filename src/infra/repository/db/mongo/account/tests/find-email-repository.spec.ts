import { FindEmailRepository } from '../find-email-repository'

beforeAll(() => {})

afterAll(() => {})

describe('FindEmailRepository', () => {
  it('should find email and return if it exists', async () => {
    const sut = new FindEmailRepository()

    const emailToVerify = 'any_email@mail.com'

    const response = await sut.find(emailToVerify)

    expect(response).toBeTruthy()
  })
})
