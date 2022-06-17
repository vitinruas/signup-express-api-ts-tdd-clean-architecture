import request from 'supertest'
import { app } from '../../config/app'

describe('Body Parser Middleware', () => {
  test('should parser body as json', async () => {
    const value = { name: 'Mary' }
    app.post('/body_parser_test', (request, response) => {
      return response.send(value)
    })
    await request(app).post('/body_parser_test').send(value).expect(value)
  })
})
