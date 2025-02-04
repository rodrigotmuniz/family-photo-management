import { NotFoundException } from "@nestjs/common"
import { IConfiguration } from "../interfaces/configurations.interface"

export default (): IConfiguration => {
  if (!process.env.PUBLIC_API) {
    throw new NotFoundException('PUBLIC_API env variable not found')
  }
  return {
    publicApi: process.env.PUBLIC_API,
  }
}
