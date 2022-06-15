export interface ICheckEmail {
  check(email: string): Promise<boolean>
}
