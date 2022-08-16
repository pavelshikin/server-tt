import {ArgumentMetadata} from '@nestjs/common'
import {Injectable, PipeTransform} from '@nestjs/common'
import {plainToClass} from 'class-transformer'
import {validate} from 'class-validator'
import {ValidationException} from '../exceptions/validation.exception'


@Injectable()
export class ValidationPipe implements PipeTransform<any> {
   async transform(value: any, { metatype }: ArgumentMetadata): Promise<any> {

      if (!metatype || !ValidationPipe.toValidate(metatype)) {
         return value;
      }
      const object = plainToClass(metatype, value);
      const errors = await validate(object)

      if(errors.length) {
         let messages = errors.map(err => {
            return `${err.property} - ${Object.values(err.constraints).join(', ')}`
         })
         throw new ValidationException(messages)
      }
      return value
   }

   private static toValidate(metatype: Function): boolean {
      const types: Function[] = [String, Boolean, Number, Array, Object];
      return !types.includes(metatype);
   }

}