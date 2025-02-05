import { Injectable, CanActivate, ExecutionContext, UnauthorizedException, forwardRef, Inject } from '@nestjs/common'
import { Request } from 'express'
import * as jwt from 'jsonwebtoken'
import { AuthService } from 'src/auth/auth.service'

@Injectable()
export class JwtAuthGuard implements CanActivate {
  private readonly secret = process.env.AUTH_SECRET || ''

  constructor(
    @Inject(forwardRef(() => AuthService))
    private readonly authService: AuthService,
  ) {}

  async canActivate(context: ExecutionContext) {
    try {
    const request = context.switchToHttp().getRequest<Request>()
    const authHeader = request.headers.authorization

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      throw new UnauthorizedException('Missing or invalid token')
    }

    const token = authHeader.split(' ')[1]

      const decoded = jwt.verify(token, this.secret)

      const photoId = this.getPhotoId(request)
      const albumId = this.getAlbumId(request)

      const hasPermission = await this.authService.hasWritePermition(decoded['id'], albumId, photoId)
      return hasPermission
    } catch (error) {
      throw new UnauthorizedException('Invalid token')
    }
  }

  private getPhotoId(request) {
    if (request.path.startsWith('/photos')) {
      return request.params.id
    }
  }
  private getAlbumId(request) {
    if (request.path.startsWith('/albums')) {
      return request.params.id
    }
  }
}
