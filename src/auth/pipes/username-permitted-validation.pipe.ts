import { ArgumentMetadata, PipeTransform, UnauthorizedException } from "@nestjs/common";

export class UsernamePermittedValidationPipe implements PipeTransform {
  transform (value: any, metadata: ArgumentMetadata) {
    return new UnauthorizedException('bla')
  }
  
}