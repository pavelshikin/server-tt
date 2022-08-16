import {Module} from "@nestjs/common"
import { ConfigModule } from '@nestjs/config';
import {TrackModule} from "./track/track.module"
import {MongooseModule} from "@nestjs/mongoose"
import {FileModule} from "./file/file.module"
import {ServeStaticModule} from "@nestjs/serve-static"
import * as path from "path"
import {AuthModule} from "./auth/auth.module"
import {UsersModule} from "./users/users.module"
import {RolesModule} from "./roles/roles.module"
import {JwtRefreshTokenStrategy} from "./auth/jwt-refresh-token.strategy"
import {PassportModule} from "@nestjs/passport"
import {PostModule} from './post/post.module'
import { AppController } from "./app.controller"


@Module({
   imports: [
      ConfigModule.forRoot(), 
      ServeStaticModule.forRoot({rootPath: path.resolve(__dirname, 'static')}),
      MongooseModule.forRoot(process.env.MONGODB_STORE_URI),
      TrackModule,
      PostModule,
      FileModule,
      AuthModule,
      UsersModule,
      RolesModule,
      PassportModule
   ],
   controllers: [AppController],
   providers: [JwtRefreshTokenStrategy]
})
export class AppModule {
}
