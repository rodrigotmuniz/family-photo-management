import { NotFoundException } from '@nestjs/common'
import { registerAs } from '@nestjs/config'

export default registerAs('authConfig', () => {
  if (!process.env.AUTH_SECRET) {
    throw new NotFoundException('AUTH_SECRET env variable not found')
  }
  if (!process.env.AUTH_EXPIRES_IN) {
    throw new NotFoundException('AUTH_EXPIRES_IN env variable not found')
  }
  return {
    secret: process.env.AUTH_SECRET,
    signOptions: { expiresIn: process.env.AUTH_EXPIRES_IN },
  }
})
