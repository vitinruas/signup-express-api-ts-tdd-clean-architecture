export interface IFindEmailRepository {
  find(email: string): Promise<boolean>
}
