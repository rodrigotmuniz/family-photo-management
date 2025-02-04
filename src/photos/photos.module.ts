import { forwardRef, Module } from '@nestjs/common'
import { PhotosService } from './photos.service'
import { Photo } from './entities/photo.entity'
import { TypeOrmModule } from '@nestjs/typeorm'
import { PhotosController } from './photos.controller'
import { User } from 'src/auth/entities/user.entity'
import { AuthModule } from 'src/auth/auth.module'

@Module({
  imports: [TypeOrmModule.forFeature([Photo]), forwardRef(() => AuthModule)],
  controllers: [PhotosController],
  providers: [PhotosService],
  exports: [PhotosService],
})
export class PhotosModule {}
