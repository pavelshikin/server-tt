import {ObjectId} from "mongoose"

export class CreateCommentDto {
   readonly trackId: ObjectId
   readonly text: string
}