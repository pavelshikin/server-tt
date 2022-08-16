import {Prop, Schema, SchemaFactory} from '@nestjs/mongoose';
import {Document} from 'mongoose';
import * as mongoose from 'mongoose';
import { Track } from 'src/track/schemas/track.schema';
import {Post} from '../../post/schemas/post.schema'


export type UserDocument = User & Document;

@Schema()
export class User {
    @Prop()
    email: string;

    @Prop()
    password: string;

    @Prop()
    username: string;

    @Prop()
    banned: boolean

    @Prop()
    banReason: string

    @Prop()
    currentHashedRefreshToken?: string

    @Prop()
    roles: string[]

    @Prop({type: [{type: mongoose.Schema.Types.ObjectId, ref: 'Track'}]})
    tracks: Track[]

    @Prop({type: [{type: mongoose.Schema.Types.ObjectId, ref: 'Post'}]})
    posts: Post[]
}

export const UserSchema = SchemaFactory.createForClass(User);