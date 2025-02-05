import { Test, TestingModule } from '@nestjs/testing'
import { HttpStatus, INestApplication, ValidationPipe } from '@nestjs/common'
import * as request from 'supertest'
import { App } from 'supertest/types'
import { TypeOrmModule } from '@nestjs/typeorm'
import { AlbumsModule } from 'src/albums/albums.module'
import { AuthModule } from 'src/auth/auth.module'
import { IntegrationsModule } from 'src/integrations/integrations.module'
import { PhotosModule } from 'src/photos/photos.module'
import { CreatePhotoDto } from 'src/photos/dto/create-photo.dto'
import { LoginSignUpDto } from 'src/auth/dto/login-sign-up.dto'
import { IPhoto } from '@app/my-library/interfaces/photo.interface'
import { Photo } from 'src/photos/entities/photo.entity'
import { PhotoResponseDto } from 'src/photos/dto/photo-response.dto'
import { APP_FILTER } from '@nestjs/core'
import { GlobalAgnosticFilter } from 'src/app/filters/global-agnostic.filter'
import { ApiErrorResponseDto } from '@app/my-library/dtos/api-error-response.dto'
import { QueryFailedErrorFilter } from 'src/app/filters/query-failed-error.filter'

// jest.mock('@app/my-library/guards/jwt.guard', () => ({
//   JwtAuthGuard: jest.fn().mockImplementation(() => ({
//     canActivate: jest.fn().mockReturnValue(true),
//   })),
// }))

describe('PhotosController (e2e)', () => {
  let app: INestApplication<App>

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        IntegrationsModule,
        AuthModule,
        TypeOrmModule.forRoot({
          type: 'postgres',
          host: 'localhost',
          port: 5432,
          username: 'postgres',
          database: 'testing',
          password: 'postgres',
          autoLoadEntities: true,
          synchronize: true,
          dropSchema: true,
        }),
        PhotosModule,
        AlbumsModule,
        PhotosModule,
      ],
       providers: [
         {
           provide: APP_FILTER,
           useClass: GlobalAgnosticFilter,
          },
          {
            provide: APP_FILTER,
            useClass: QueryFailedErrorFilter,
          },
        ],
    }).compile()

    app = module.createNestApplication()

    app.useGlobalPipes(
      new ValidationPipe({
        whitelist: true,
        forbidNonWhitelisted: true,
        transform: false,
      }),
    )

    await app.init()

    const validUserPayload: LoginSignUpDto = {
      password: 'Ab #23 asdf 33',
      username: 'Bret',
    }
    await request(app.getHttpServer()).post('/auth/sign-up').send(validUserPayload)
  })

  afterEach(async () => {
    await app.close()
  })

  describe('POST: /photos', () => {
    it('should create a new photo', async () => {
      const validPhotoPayload: CreatePhotoDto = {
        albumId: 1,
        title: 'Some nice title',
      }
      const response = await request(app.getHttpServer()) //
        .post('/photos')
        .send(validPhotoPayload)
        .expect(HttpStatus.CREATED)

      const expected: PhotoResponseDto = {
        album: { id: validPhotoPayload.albumId },
        id: 501,
        title: validPhotoPayload.title,
        createdAt: expect.any(String),
        refId: null,
        updatedAt: expect.any(String),
      }
      expect(response.body).toEqual(expected)
    })

    it.only('should throw QueryFailedError if album does not exist', async () => {
      const validPhotoPayload: CreatePhotoDto = {
        albumId: 11, // Innexistent album
        title: 'Some nice title',
      }
      const response = await request(app.getHttpServer()) //
        .post('/photos')
        .send(validPhotoPayload)
        .expect(HttpStatus.CONFLICT)

      const expected: ApiErrorResponseDto = {
        message: 'Key (albumId)=(11) is not present in table \"albums\".',
        path: '/photos',
        statusCode: HttpStatus.CONFLICT,
        timestamp: expect.any(String),
      }
      expect(response.body).toEqual(expected)
    }, 100000)
  })
})
