import { Test, TestingModule } from '@nestjs/testing'
import { PhotosService } from './photos.service'
import { PhotosController } from './photos.controller'
import { AuthService } from 'src/auth/auth.service'

const mockPhoto = { id: 1, title: 'Test Photo', album: { id: 1 } }

describe('PhotosController', () => {
  let controller: PhotosController
  let service: PhotosService

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PhotosController],
      providers: [
        {
          provide: PhotosService,
          useValue: {
            create: jest.fn().mockReturnValue(mockPhoto),
            save: jest.fn().mockResolvedValue(mockPhoto),
            findById: jest.fn().mockResolvedValue(mockPhoto),
            delete: jest.fn().mockResolvedValue({ affected: 1 }),
          },
        },
        {
          provide: AuthService,
          useValue: {
            create: jest.fn().mockReturnValue(mockPhoto),
            save: jest.fn().mockResolvedValue(mockPhoto),
            findById: jest.fn().mockResolvedValue(mockPhoto),
            delete: jest.fn().mockResolvedValue({ affected: 1 }),
          },
        },
      ],
    }).compile()

    controller = module.get<PhotosController>(PhotosController)
    service = module.get<PhotosService>(PhotosService)
  })

  it('should create a photo', async () => {
    jest.spyOn(service, 'create').mockResolvedValue(mockPhoto as any)
    const result = await controller.create({ title: 'Test Photo', albumId: 1 })
    expect(result).toEqual(mockPhoto)
  })

  it('should find a photo by ID', async () => {
    jest.spyOn(service, 'findById').mockResolvedValue(mockPhoto as any)
    const result = await controller.findById(1)
    expect(result).toEqual(mockPhoto)
  })
})
