import {ObjectId} from 'mongoose'
import {IsNotEmpty} from 'class-validator'

export class UpdatePostDto {
   @IsNotEmpty({message: 'Не может быть пустым'})
   readonly title: string

   readonly content?: string

   @IsNotEmpty({message: 'Укажите id'})
   readonly id: ObjectId
}
