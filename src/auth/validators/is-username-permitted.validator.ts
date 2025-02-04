import { Injectable } from '@nestjs/common'
import { registerDecorator, ValidationOptions, ValidatorConstraint, ValidatorConstraintInterface } from 'class-validator'
import { AuthService } from '../auth.service'

@ValidatorConstraint({ async: true })
@Injectable()
export class IsUsernamePermittedValidator implements ValidatorConstraintInterface {
  constructor(private readonly authService: AuthService) {}
  async validate(value: any) {
    console.log('Do not use!')
    return false
    console.log('bla')
  }

  defaultMessage(): string {
    return 'The value must be an uppercase string'
  }
}

export function IsUsernamePermitted(validationOptions?: ValidationOptions) {
  return function (object: Object, propertyName: string) {
    registerDecorator({
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      constraints: [],
      validator: IsUsernamePermittedValidator,
    })
  }
}
