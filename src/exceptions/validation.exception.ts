import {HttpException, HttpStatus} from '@nestjs/common'

export class ValidationException extends HttpException{
   messages

   constructor(response) {
      if(!response) {
      }
      super(response, HttpStatus.BAD_REQUEST)
      this.messages = response
   }

}