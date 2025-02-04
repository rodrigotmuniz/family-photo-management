import { IApiUser } from '@app/my-library/interfaces/public-api/api-user.interface'
import { HttpService } from '@nestjs/axios'
import { Injectable, Logger } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { firstValueFrom } from 'rxjs'
import { IConfiguration } from './interfaces/configurations.interface'
import { IApiAlbum } from '@app/my-library/interfaces/public-api/api-album.interface'
import { IApiPhoto } from '@app/my-library/interfaces/public-api/api-photo.interface'

@Injectable()
export class IntegrationsService {
  private readonly logger = new Logger(IntegrationsService.name)

  constructor(
    private readonly httpService: HttpService,
    private readonly configService: ConfigService<IConfiguration, true>,
  ) {}

  async findAllUsernames() {
    this.logger.log(`findAllUsernames()`)
    const fetchedUsers = await this.fetchUsers()
    const usernames = fetchedUsers.map((user) => user.username)
    return usernames
  }

  async fetchUsers() {
    this.logger.log(`fetchUsers()`)

    const publicApi = this.configService.get('publicApi', { infer: true })
    const observable = this.httpService.get(`${publicApi}/users`)
    const { data } = await firstValueFrom<{ data: IApiUser[] }>(observable)
    return data
  }

  async fetchAlbumsByUserId(userId: number) {
    this.logger.log(`fetchAlbumsByUserId()`)

    const publicApi = this.configService.get('publicApi', { infer: true })
    const observable = this.httpService.get(`${publicApi}/users/${userId}/albums`)
    const { data } = await firstValueFrom<{ data: IApiAlbum[] }>(observable)
    return data
  }

  async fetchPhotosByAlbumId(albumIds: number[]) {
    this.logger.log(`fetchPhotosByAlbumId()`)

    const publicApi = this.configService.get('publicApi', { infer: true })
    const promises = albumIds.map((albumId) => {
      const observable = this.httpService.get(`${publicApi}/albums/${albumId}/photos`)
      return firstValueFrom<{ data: IApiPhoto[] }>(observable)
    })
    const responseList = await Promise.all(promises)
    const photos = responseList.flatMap(item => item.data)
    return photos
  }
}
