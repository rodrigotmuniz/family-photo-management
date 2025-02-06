import { forwardRef, Module } from '@nestjs/common'
import { JwtModule } from '@nestjs/jwt'
import { TypeOrmModule } from '@nestjs/typeorm'
import { AlbumsModule } from 'src/albums/albums.module'
import { IntegrationsModule } from 'src/integrations/integrations.module'
import { PhotosModule } from 'src/photos/photos.module'
import jwtConfig from './auth.config'
import { AuthController } from './auth.controller'
import { AuthService } from './auth.service'
import { User } from './entities/user.entity'

@Module({
  imports: [
    TypeOrmModule.forFeature([User]),
    IntegrationsModule,
    forwardRef(() => AlbumsModule),
    PhotosModule,
    JwtModule.registerAsync(jwtConfig.asProvider()),
  ],
  controllers: [AuthController],
  providers: [AuthService],
  exports: [AuthService], 
})
export class AuthModule {}
