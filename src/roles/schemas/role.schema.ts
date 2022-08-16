import {Prop, Schema, SchemaFactory} from '@nestjs/mongoose';
import {Document} from 'mongoose';
import * as mongoose from 'mongoose';
import {User} from '../../users/schemas/user.schema'


export type RoleDocument = Role & Document;

@Schema()
export class Role {
    @Prop()
    value: string;

    @Prop()
    description: string;

    @Prop({type: [{type: mongoose.Schema.Types.ObjectId, ref: 'User'}]})
    users: User[]
}

export const RoleSchema = SchemaFactory.createForClass(Role);