import { NotFoundException } from '@nestjs/common'
export default () => {
  if (!process.env.PUBLIC_API) {
    throw new NotFoundException('PUBLIC_API env variable not found')
  }
  return {
    publicApi: process.env.PUBLIC_API,
  }
}
