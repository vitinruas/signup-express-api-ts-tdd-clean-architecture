export class ServerError extends Error {
  constructor() {
    super(`Unexpected Internal Error 500`)
    this.name = 'ServerError'
  }
}
