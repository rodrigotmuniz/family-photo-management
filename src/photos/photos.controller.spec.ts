import { Test, TestingModule } from '@nestjs/testing'
import { PhotosService } from './photos.service'
import { PhotosController } from './photos.controller'
import { AuthService } from 'src/auth/auth.service'

describe('PhotosController', () => {
  let controller: PhotosController
  let service: PhotosService
  let authService: AuthService

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PhotosController],
      providers: [
        {
          provide: PhotosService,
          useValue: {
            create: jest.fn(),
            update: jest.fn(),
            findById: jest.fn(),
            remove: jest.fn(),
          },
        },
        {
          provide: AuthService,
          useValue: {},
        },
      ],
    }).compile()

    controller = module.get<PhotosController>(PhotosController)
    service = module.get<PhotosService>(PhotosService)
    authService = module.get<AuthService>(AuthService)
  })

  describe('Dependencies', () => {
    it('should verify if all dependencies are defined', async () => {
      expect(controller).toBeDefined()
      expect(service).toBeDefined()
      expect(authService).toBeDefined()
    })
  })

  describe('create', () => {
    it('should create a new photo', async () => {
      // ARANGE
      const params = Symbol('params') as any
      const createOutput = Symbol('createOutput') as any

      jest.spyOn(service, 'create').mockResolvedValue(createOutput)

      // ACT
      const received = await controller.create(params)

      // ASSERT
      expect(received).toBe(createOutput)
      expect(service.create).toHaveBeenLastCalledWith(params)
    })
  })
  describe('function', () => {
    it('should c...', async () => {
      // ARANGE

      // ACT

      // ASSERT
      expect(1).toBe(1)
    })
  })
})
