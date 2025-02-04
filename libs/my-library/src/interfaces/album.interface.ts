import { IUser } from './user.interface'

export interface IAlbum {
  id?: number
  refId: number
  title: string
  user: Partial<IUser>
}
