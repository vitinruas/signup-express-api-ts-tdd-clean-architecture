export interface ILogRepository {
  logServerError(stack: string): Promise<void>
}
