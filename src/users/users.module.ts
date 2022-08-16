import {forwardRef, Module} from '@nestjs/common'
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import {AuthModule} from '../auth/auth.module'
import {MongooseModule} from "@nestjs/mongoose"
import {User, UserSchema} from "./schemas/user.schema"
import {RolesModule} from '../roles/roles.module'


@Module({
  controllers: [UsersController],
  providers: [UsersService],
  imports: [
      MongooseModule.forFeature([{name: User.name, schema: UserSchema}]),
     RolesModule,
     forwardRef(() => AuthModule)
  ],
   exports: [
      UsersService
   ]
})
export class UsersModule {}
