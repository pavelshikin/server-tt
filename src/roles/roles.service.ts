import {HttpException, HttpStatus, Injectable} from '@nestjs/common'
import {InjectModel} from '@nestjs/mongoose'
import {CreateRoleDto} from './dto/create-role.dto'
import {Role, RoleDocument} from './schemas/role.schema'
import {Model} from "mongoose"


@Injectable()
export class RolesService {

   constructor(@InjectModel(Role.name) private roleModel: Model<RoleDocument>) {
   }

   async createRole(dto: CreateRoleDto) {
      const role = await this.roleModel.create(dto)
      return role
   }

   async getRoleByValue(value: string) {
      const role = await this.roleModel.findOne({value})
      if(!role){
         throw new HttpException('Роль не найдена', HttpStatus.NOT_FOUND)
      }
      return role
   }
}
