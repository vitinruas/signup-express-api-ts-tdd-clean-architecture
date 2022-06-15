export type gender = 'M' | 'F' | 'O' | 'N'
export interface IAccountEntitie {
  id: string
  name: string
  gender: gender
  email: string
  password: string
}
