import { gender, IAccountEntitie } from '../entities/account-entitie'

export interface INewAccountData {
  name: string
  gender: gender
  email: string
  password: string
}

export interface IAddAccount {
  add(newAccountData: INewAccountData): Promise<IAccountEntitie>
}
