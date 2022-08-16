import {Module} from "@nestjs/common"
import { PostService } from "./post.service"
import {MongooseModule} from "@nestjs/mongoose"
import {Post, PostSchema} from "./schemas/post.schema"
import { PostController } from "./post.controller"
import {Category, CategorySchema} from "./schemas/category.schema"
import {User, UserSchema} from "../users/schemas/user.schema"
import {AuthModule} from '../auth/auth.module'
import {UsersModule} from '../users/users.module'


@Module({
   imports: [
      MongooseModule.forFeature([{name: Post.name, schema: PostSchema}]),
      MongooseModule.forFeature([{name: Category.name, schema: CategorySchema}]),
      MongooseModule.forFeature([{name: User.name, schema: UserSchema}]),
      UsersModule,
      AuthModule
   ],
   controllers: [PostController],
   providers: [PostService]
})
export class PostModule {

}