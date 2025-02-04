import { IAlbum } from '@app/my-library/interfaces/album.interface'
import { IPhoto } from '@app/my-library/interfaces/photo.interface'
import { IApiAlbum } from '@app/my-library/interfaces/public-api/api-album.interface'
import { IApiPhoto } from '@app/my-library/interfaces/public-api/api-photo.interface'
import { IApiUser } from '@app/my-library/interfaces/public-api/api-user.interface'
import { ConflictException, Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { AlbumsService } from 'src/albums/albums.service'
import { IntegrationsService } from 'src/integrations/integrations.service'
import { PhotosService } from 'src/photos/photos.service'
import { Repository } from 'typeorm'
import { LoginSignUpDto } from './dto/login-sign-up.dto'
import { User } from './entities/user.entity'
import { JwtService } from '@nestjs/jwt'

@Injectable()
export class AuthService {
  constructor(
    private readonly integrationsService: IntegrationsService,
    private readonly albumsService: AlbumsService,
    private readonly photosService: PhotosService,

    @InjectRepository(User)
    private readonly repository: Repository<User>,
    private readonly jwtService: JwtService,
  ) {}

  async hasWritePermition(userId: number, albumId?: number, photoId?: number) {
    const user = await this.repository.find({
      where: {
        albums: { id: albumId },
        photos: { id: photoId },
        id: userId,
      },
    })
    return !!user.length
  }

  async signUp(loginSignUpDto: LoginSignUpDto) {
    // return await this.repository.find({ where: { albums: { id: 2 }, photos: { id: 232 }, id: 1 } })
    const fetchedUsers = await this.fetchUsers()
    const user = this.findUserByUsername(loginSignUpDto.username, fetchedUsers)
    await this.userAlreadyExistsVerification(user.id)
    const auth = this.combineUserWithLoginDto(user, loginSignUpDto)
    const savedAuth = await this.create(auth)

    const fetchedAlbums = await this.fetchAlbumsByUserId(savedAuth.refId)
    const savedAlbums = await this.createAlbums(fetchedAlbums, savedAuth.id)

    const fetchedPhotos = await this.fetchPhotosByApiAlbums(savedAlbums)
    await this.createPhotos(fetchedPhotos, savedAlbums, savedAuth.id)

    const { id } = savedAuth

    const token = this.jwtService.sign({ id })
    return { accessToken: token }
  }

  async login(loginSignUpDto: LoginSignUpDto) {
    const { password, username } = loginSignUpDto
    const foundUser = await this.repository.findOne({ where: { username, password }, select: { username: true } })
    if (!foundUser) {
      throw new UnauthorizedException('Username or password are invalid!')
    }
    const token = this.jwtService.sign({ id: foundUser.id })
    return { accessToken: token }
  }

  private async fetchUsers() {
    const fetchedUsers = await this.integrationsService.fetchUsers()
    if (!fetchedUsers) {
      throw new NotFoundException('No users found in the public API')
    }
    return fetchedUsers
  }

  private async fetchAlbumsByUserId(userId: number) {
    const fetchedAlbums = await this.integrationsService.fetchAlbumsByUserId(userId)
    if (!fetchedAlbums) {
      throw new NotFoundException('No albums found in the public API')
    }
    return fetchedAlbums
  }

  private async fetchPhotosByApiAlbums(albums: IAlbum[]) {
    const albumIds = albums.map((album) => album.refId)
    const fetchedPhotos = await this.integrationsService.fetchPhotosByAlbumId(albumIds)
    if (!fetchedPhotos) {
      throw new NotFoundException('No photos found in the public API')
    }
    return fetchedPhotos
  }

  private findUserByUsername(username: string, users: IApiUser[]) {
    const user = users.find((user) => user.username === username)
    if (!user) {
      const usernames = this.getUsernames(users)
      throw new NotFoundException(`User with username ${username} not found! Suggestions: ${usernames.join(' , ')}`)
    }
    return user
  }

  private async userAlreadyExistsVerification(id: number) {
    const foundUser = await this.repository.findOne({ where: { id }, select: { username: true } })
    if (foundUser) {
      throw new ConflictException(`User with username ${foundUser.username} already registered!`)
    }
  }

  private getUsernames(users: IApiUser[]) {
    const usernames = users.map((user) => user.username)
    return usernames
  }

  private combineUserWithLoginDto(user: IApiUser, loginDto: LoginSignUpDto) {
    const { password } = loginDto
    const { id, username, ...data } = user
    const auth = this.repository.create({ username, password, data, refId: id })
    return auth
  }

  private async create(auth: User) {
    const createAuth = await this.repository.save(auth)
    return createAuth
  }

  private async createAlbums(albums: IApiAlbum[], userId: number) {
    const userAlbums: IAlbum[] = albums.map((album) => {
      return {
        refId: album.id,
        user: { id: userId },
        title: album.title,
      }
    })
    const savedAlbums = await this.albumsService.createMany(userAlbums)
    return savedAlbums as IAlbum[]
  }

  private async createPhotos(fetchedPhotos: IApiPhoto[], savedAlbums: IAlbum[], userId: number) {
    const albumPhotos: IPhoto[] = fetchedPhotos.map((photo) => {
      const album = savedAlbums.find((album) => album.refId === photo.albumId)
      if (!album) {
        throw new NotFoundException('Album not found')
      }
      return {
        album,
        refId: photo.id,
        thumbnailUrl: photo.thumbnailUrl,
        url: photo.url,
        title: photo.title,
        user: { id: userId },
      }
    })
    await this.photosService.createMany(albumPhotos)

    return fetchedPhotos
  }
}
