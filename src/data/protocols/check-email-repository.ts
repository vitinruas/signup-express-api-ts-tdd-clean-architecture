export interface ICheckEmailRepository {
  find(email: string): Promise<boolean>
}
