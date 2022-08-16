import {ObjectId} from 'mongoose'
import {IsNotEmpty} from 'class-validator'

export class CreatePostDto {
   @IsNotEmpty({message: 'Не может быть пустым'})
   readonly title: string

   readonly content?: string

   @IsNotEmpty({message: 'Укажите категорию'})
   readonly categoryId: ObjectId
}