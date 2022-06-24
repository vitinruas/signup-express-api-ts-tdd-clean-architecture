import {
  IController,
  ILogRepository,
  IHttpRequest,
  IHttpResponse,
} from './log-controller-decorator-protocols'

export class LogControllerDecorator implements IController {
  private readonly controller: IController
  private readonly logRepository: ILogRepository

  constructor(controller: IController, logRepository: ILogRepository) {
    this.controller = controller
    this.logRepository = logRepository
  }

  async perform(httpRequest: IHttpRequest): Promise<IHttpResponse> {
    const httpResponse: IHttpResponse = await this.controller.perform(
      httpRequest,
    )
    if (httpResponse.statusCode >= 500) {
      this.logRepository.logServerError(httpResponse.body.stack)
    }
    return httpResponse
  }
}
