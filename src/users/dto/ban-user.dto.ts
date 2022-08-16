import {ObjectId} from "mongoose"
import {IsNotEmpty, IsString} from 'class-validator'

export class BanUserDto {
   @IsNotEmpty({message: 'Не может быть пустым'})
   readonly userId: ObjectId
   @IsString({message: 'Должно быть строкой'})
   readonly banReason: string
}