import { forwardRef, Module } from '@nestjs/common'
import { AlbumsService } from './albums.service'
import { Album } from './entities/album.entity'
import { TypeOrmModule } from '@nestjs/typeorm'
import { AuthModule } from 'src/auth/auth.module'
import { AuthService } from 'src/auth/auth.service'
import { AlbumController } from './albums.controller'
import { ApolloDriverConfig, ApolloDriver } from '@nestjs/apollo'
import { GraphQLModule } from '@nestjs/graphql'

@Module({
  imports: [
    TypeOrmModule.forFeature([Album]),
    forwardRef(() => AuthModule),
  ],
  controllers: [AlbumController],
  providers: [AlbumsService],
  exports: [AlbumsService],
})
export class AlbumsModule {}
