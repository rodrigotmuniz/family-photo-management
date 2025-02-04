import { forwardRef, Module } from '@nestjs/common'
import { MyLibraryService } from './my-library.service'
import { AuthModule } from 'src/auth/auth.module'
import { AuthService } from 'src/auth/auth.service'

@Module({
  providers: [MyLibraryService],
  exports: [MyLibraryService],
})
export class MyLibraryModule {}
