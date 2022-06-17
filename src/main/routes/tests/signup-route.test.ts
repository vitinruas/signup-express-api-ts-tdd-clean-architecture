import request from 'supertest'
import app from '../../config/app'
describe('SignUp Router', () => {
  test('should return a 200 success code and the new created account', async () => {
    await request(app)
      .post('/signup')
      .send({
        name: 'any_name',
        gender: 'N',
        email: 'any_email@mail.com',
        password: 'any_password',
      })
      .expect(200)
  })
})
