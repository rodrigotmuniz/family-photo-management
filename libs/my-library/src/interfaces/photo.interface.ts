import { IAlbum } from './album.interface'
import { IUser } from './user.interface'

export interface IPhoto {
  id?: number
  refId: number
  title: string
  url: string
  thumbnailUrl: string
  album: Partial<IAlbum>
  user: Partial<IUser>
}
