import { TestingModule, Test } from "@nestjs/testing";
import { getRepositoryToken } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { Photo } from "./entities/photo.entity";
import { PhotosService } from "./photos.service";
import { NotFoundException } from "@nestjs/common";

const mockPhotoRepository = {
  create: jest.fn(),
  save: jest.fn(),
  findOne: jest.fn(),
  delete: jest.fn(),
};

const mockAlbumRepository = {
  findOne: jest.fn(),
};

describe('PhotosService', () => {
  let service: PhotosService;
  let photoRepository: Repository<Photo>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PhotosService,
        {
          provide: getRepositoryToken(Photo),
          useValue: mockPhotoRepository,
        },
        // {
        //   provide: getRepositoryToken(Album),
        //   useValue: mockAlbumRepository,
        // },
      ],
    }).compile();

    service = module.get<PhotosService>(PhotosService);
    photoRepository = module.get<Repository<Photo>>(getRepositoryToken(Photo));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should create a photo', async () => {
    const dto = { title: 'Test Photo', albumId: 1 };
    const album = { id: 1 };
    const photo = { id: 1, title: 'Test Photo', album };

    mockAlbumRepository.findOne.mockResolvedValue(album);
    mockPhotoRepository.create.mockReturnValue(photo);
    mockPhotoRepository.save.mockResolvedValue(photo);

    expect(await service.create(dto)).toEqual(photo);
    expect(mockPhotoRepository.create).toHaveBeenCalledWith({ album, title: dto.title });
    expect(mockPhotoRepository.save).toHaveBeenCalledWith(photo);
  });

  it('should find a photo by ID', async () => {
    const photo = { id: 1, title: 'Test Photo' };
    mockPhotoRepository.findOne.mockResolvedValue(photo);

    expect(await service.findById(1)).toEqual(photo);
    expect(mockPhotoRepository.findOne).toHaveBeenCalledWith({ where: { id: 1 } });
  });

  it('should throw NotFoundException when photo is not found', async () => {
    mockPhotoRepository.findOne.mockResolvedValue(null);

    await expect(service.findById(1)).rejects.toThrow(NotFoundException);
  });

  it('should delete a photo', async () => {
    mockPhotoRepository.delete.mockResolvedValue({ affected: 1 });

    expect(await service.remove(1)).toEqual({ message: 'Photo deleted successfully!' });
    expect(mockPhotoRepository.delete).toHaveBeenCalledWith({ id: 1 });
  });

  it('should throw NotFoundException when deleting a non-existent photo', async () => {
    mockPhotoRepository.delete.mockResolvedValue({ affected: 0 });

    await expect(service.remove(1)).rejects.toThrow(NotFoundException);
  });

  it('should update a photo', async () => {
    const existingPhoto = { id: 1, title: 'Old Title', album: { id: 1 } };
    const updateDto = { title: 'New Title' };
    const updatedPhoto = { ...existingPhoto, ...updateDto };

    mockPhotoRepository.findOne.mockResolvedValue(existingPhoto);
    mockPhotoRepository.create.mockReturnValue(updatedPhoto);
    mockPhotoRepository.save.mockResolvedValue(updatedPhoto);

    expect(await service.update(1, updateDto)).toEqual(updatedPhoto);
    expect(mockPhotoRepository.create).toHaveBeenCalledWith(updatedPhoto);
    expect(mockPhotoRepository.save).toHaveBeenCalledWith(updatedPhoto);
  });
});
