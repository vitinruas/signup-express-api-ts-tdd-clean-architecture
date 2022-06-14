export class SignUpController {
  perform(httpRequest: any): any {
    if (!httpRequest.body.name) {
      return {
        statusCode: 400,
      }
    }
  }
}
