import { IApiUser } from './public-api/api-user.interface'

export interface IUser {
  id?: number
  username: string
  password: string // Should be encrypted!!!! I am using the pain password just for this challenge
  refId: number
  data: IApiUser
}
