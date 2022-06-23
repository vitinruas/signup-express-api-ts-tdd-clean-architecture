import request from 'supertest'
import app from '../../config/app'

describe('CORS Middleware', () => {
  // should enable cors
  test('should enable cors', async () => {
    app.post('/cors_test', (request, response) => {
      return response.send()
    })
    await request(app)
      .post('/cors_test')
      .expect('access-controll-allow-headers', '*')
      .expect('access-controll-allow-origin', '*')
      .expect('access-controll-allow-methods', '*')
  })
})
