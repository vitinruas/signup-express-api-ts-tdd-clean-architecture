export interface IFindEmailRepository {
  find(email: string): Promise<string | undefined>
}
