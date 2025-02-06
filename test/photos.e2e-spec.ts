import { Test, TestingModule } from '@nestjs/testing'
import { HttpStatus, INestApplication, ValidationPipe } from '@nestjs/common'
import * as request from 'supertest'
import { App } from 'supertest/types'
import { CreatePhotoDto } from 'src/photos/dto/create-photo.dto'
import { LoginSignUpDto } from 'src/auth/dto/login-sign-up.dto'
import { PhotoResponseDto } from 'src/photos/dto/photo-response.dto'
import { ApiErrorResponseDto } from '@app/my-library/dtos/api-error-response.dto'
import { AppModule } from 'src/app/app.module'

describe('PhotosController (e2e)', () => {
  let app: INestApplication<App>

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
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

    it('should throw QueryFailedError if album does not exist', async () => {
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
