import {Prop, Schema, SchemaFactory} from '@nestjs/mongoose'
import {Date, Document} from 'mongoose'
import * as mongoose from 'mongoose'
import {Category} from "./category.schema"


export type PostDocument = Post & Document;

@Schema()
export class Post {
   @Prop()
   title: string

   @Prop()
   content: string

   @Prop({type: Date, default: Date.now})
   created: Date

   @Prop({type: [{type: mongoose.Schema.Types.ObjectId, ref: 'Category'}]})
   category: Category[]
}

export const PostSchema = SchemaFactory.createForClass(Post)