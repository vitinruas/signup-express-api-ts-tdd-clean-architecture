export interface ICheckEmailRepository {
  find(email: string): Promise<object>
}
