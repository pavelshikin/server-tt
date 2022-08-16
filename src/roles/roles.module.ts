import {forwardRef, Module } from '@nestjs/common';
import { RolesService } from './roles.service';
import { RolesController } from './roles.controller';
import {AuthModule} from '../auth/auth.module'
import {MongooseModule} from "@nestjs/mongoose"
import {Role, RoleSchema} from "./schemas/role.schema"

@Module({
  providers: [RolesService],
  controllers: [RolesController],
  imports: [
    MongooseModule.forFeature([{name: Role.name, schema: RoleSchema}]),
    forwardRef(() => AuthModule)
  ],
  exports: [
     RolesService
  ]
})
export class RolesModule {}
