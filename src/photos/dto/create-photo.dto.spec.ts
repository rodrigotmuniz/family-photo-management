import { validate } from 'class-validator'
import { CreatePhotoDto } from './create-photo.dto'

describe('CreatePhotoDto', () => {
  let dto: CreatePhotoDto

  beforeEach(() => {
    dto = new CreatePhotoDto()
  })
  it('should success with a valid DTO', async () => {
    // ARANGE
    dto.albumId = 1
    dto.title = 'valide title'

    // ACT
    const errors = await validate(dto)

    // ASSERT
    expect(errors.length).toBe(0)
  })
  it('should fail when albumId is not number', async () => {
    // ARANGE
    const albumId = ['1', '', false, true, () => {}, [], Symbol(''), null, undefined]
    dto.title = 'valide title'

    albumId.forEach(async (albumId: any) => {
      dto.albumId = albumId

      // ACT
      const received = await validate(dto)

      // ASSERT
      expect(received.length).toBe(1)
      expect(received[0].property).toBe('albumId')
    })
  })
  it('should fail when title is not string', async () => {
    // ARANGE
    const titles = [1, 0, false, true, () => {}, [], Symbol(''), null, undefined]
    dto.albumId = 1

    titles.forEach(async (title: any) => {
      dto.title = title

      // ACT
      const received = await validate(dto)

      // ASSERT
      expect(received.length).toBe(1)
      expect(received[0].property).toBe('title')
    })
  })
  it('should fail when all attributes are invalid', async () => {
    // ARANGE
    dto.albumId = null as any
    dto.title = null as any

    // ACT
    const received = await validate(dto)

    // ASSERT
    expect(received.length).toBe(2)
    expect(received[1].property).toBe('albumId')
    expect(received[0].property).toBe('title')
  })
})
