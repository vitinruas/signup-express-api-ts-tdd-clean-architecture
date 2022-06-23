export class ServerError extends Error {
  constructor(stack: string) {
    super(`Unexpected Internal Error 500`)
    this.name = 'ServerError'
    this.stack = stack
  }
}
