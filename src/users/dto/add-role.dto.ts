import {IsString} from 'class-validator'
import {ObjectId} from "mongoose"

export class AddRoleDto {
   @IsString({message: 'Должно быть строкой'})
   readonly value: string
   readonly userId: ObjectId
}