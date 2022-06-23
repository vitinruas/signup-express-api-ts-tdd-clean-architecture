import request from 'supertest'
import app from '../../config/app'

describe('Content Type Middleware', () => {
  // should default content type as Json
  test('should return default type as json', async () => {
    app.post('/test_content_type', (request, response) => {
      return response.send({
        iReceive: request.body,
      })
    })

    await request(app)
      .post('/test_content_type')
      .send('Hello!')
      .expect('content-type', /json/)
  })
})
