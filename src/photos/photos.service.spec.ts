import { Repository } from 'typeorm'
import { PhotosService } from './photos.service'
import { Photo } from './entities/photo.entity'
import { Test, TestingModule } from '@nestjs/testing'
import { getRepositoryToken, TypeOrmModule } from '@nestjs/typeorm'
import { CreatePhotoDto } from './dto/create-photo.dto'
import { IPhoto } from '@app/my-library/interfaces/photo.interface'
import { NotFoundException } from '@nestjs/common'

describe('Photos Service', () => {
  let service: PhotosService
  let repository: Repository<Photo>

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PhotosService,
        {
          provide: getRepositoryToken(Photo),
          useValue: {
            create: jest.fn(),
            save: jest.fn(),
            delete: jest.fn(),
            findOneBy: jest.fn(),
          },
        },
      ],
    }).compile()
    service = module.get(PhotosService)
    repository = module.get(getRepositoryToken(Photo))
  })

  describe('photosService', () => {
    it('should be defined', () => {
      expect(service).toBeDefined()
    })
  })
  describe('photosRepository', () => {
    it('should be defined', () => {
      expect(repository).toBeDefined()
    })
  })
  describe('create', () => {
    it('should create a new photo', async () => {
      // ARANGE
      const createPhotoDto: CreatePhotoDto = {
        albumId: 1,
        title: 'Title 1',
      }
      const createInput: Partial<IPhoto> = {
        album: { id: createPhotoDto.albumId },
        title: createPhotoDto.title,
      }

      const createResponse = Symbol('createResponse') as any
      jest.spyOn(repository, 'create').mockReturnValue(createResponse)

      const saveResponse = Symbol('saveResponse') as never
      jest.spyOn(repository, 'save').mockResolvedValue(saveResponse)

      // ACT
      const received = await service.create(createPhotoDto)

      // ASSERT
      expect(repository.create).toHaveBeenCalledWith(createInput)
      expect(repository.save).toHaveBeenCalledWith(createResponse)
      expect(received).toBe(saveResponse)
    })
  })
  describe('findById', () => {
    it('should retrieve a photo by id', async () => {
      // ARANGE
      const id = 1
      const findOneByInput = { id }
      const findOneByOutput = Symbol('findOneByOutput') as any

      jest.spyOn(repository, 'findOneBy').mockResolvedValue(findOneByOutput)

      // ACT
      const received = await service.findById(id)

      // ASSERT
      expect(received).toEqual(findOneByOutput)
      expect(repository.findOneBy).toHaveBeenLastCalledWith(findOneByInput)
    })
    it('should throw NotFoundException if no photo is found', async () => {
      // ARANGE
      const id = 1
      const findOneByInput = { id }
      const findOneByOutput = null

      jest.spyOn(repository, 'findOneBy').mockResolvedValue(findOneByOutput)

      // ACT
      const received = service.findById(id)

      // ASSERT
      await expect(received).rejects.toThrow(new NotFoundException(`Photo with id: ${id} was not found.`))
      expect(repository.findOneBy).toHaveBeenLastCalledWith(findOneByInput)
    })
  })
  describe('remove', () => {
    it('should remove a photo by id', async () => {
      // ARANGE
      const id = 1
      const deleteInput = { id }
      const deleteOutput = Symbol('deleteOutput') as any

      jest.spyOn(repository, 'delete').mockResolvedValue(deleteOutput)

      const expected = { message: 'Photo deleted successfully!' }

      // ACT
      const received = await service.remove(id)

      // ASSERT
      expect(received).toEqual(expected)
      expect(repository.delete).toHaveBeenLastCalledWith(deleteInput)
    })
    it('should throw NotFoundException if no photo is found', async () => {
      // ARANGE
      const id = 1
      const deleteInput = { id }
      const deleteOutput = { affected: 0 } as any

      jest.spyOn(repository, 'delete').mockResolvedValue(deleteOutput)

      // ACT
      const received = service.remove(id)

      // ASSERT
      await expect(received).rejects.toThrow(new NotFoundException(`Photo with id: ${id} was not found.`))
      expect(repository.delete).toHaveBeenLastCalledWith(deleteInput)
    })
  })

  describe('createMany', () => {
    it('should create new photos', async () => {
      // ARANGE
      const photos = [Symbol('photo 1'), Symbol('photo 2')] as any
      const createResponse = Symbol('createResponse') as never
      const saveResponse = Symbol('saveResponse') as never

      jest.spyOn(repository, 'create').mockReturnValue(createResponse)
      jest.spyOn(repository, 'save').mockReturnValue(saveResponse)

      // ACT

      const received = await service.createMany(photos)

      // ASSERT
      expect(received).toEqual(saveResponse)
      expect(repository.create).toHaveBeenLastCalledWith(photos)
      expect(repository.save).toHaveBeenLastCalledWith(createResponse)
    })
  })
  describe('update', () => {
    it('should update a photo', async () => {
      // ARANGE
      const params = {
        id: 1,
        updatePhotoDto: { title: 'Some title!' },
      }
      const findByIdInput = params.id
      const findByIdOutput = {id: 2, title: 'Some other title...'} as any
      const createInput = {...findByIdOutput, ...params.updatePhotoDto}
      const createOutput = Symbol('createOutput') as any
      const saveOutput = Symbol('saveOutput') as any

      jest.spyOn(service, 'findById').mockResolvedValue(findByIdOutput)
      jest.spyOn(repository, 'create').mockReturnValue(createOutput)
      jest.spyOn(repository, 'save').mockResolvedValue(saveOutput)

      // ACT
      const received = await service.update(params.id, params.updatePhotoDto)

      // ASSERT
      expect(received).toBe(saveOutput)
      expect(service.findById).toHaveBeenLastCalledWith(findByIdInput)
      expect(repository.create).toHaveBeenLastCalledWith(createInput)
    })
  })
})
