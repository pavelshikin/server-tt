import {Body, Controller, Get, Param, Post, UseGuards} from '@nestjs/common'
import {RolesService} from './roles.service'
import {CreateRoleDto} from './dto/create-role.dto'
import {Roles} from '../auth/roles-auth.decorator'
import {RolesGuard} from '../auth/roles.guard'

@Controller('roles')
export class RolesController {

   constructor(private roleService: RolesService) {}

   @Roles('OWNER')
   @UseGuards(RolesGuard)
   @Post()
   create(@Body() dto: CreateRoleDto){
      return this.roleService.createRole(dto)
   }

   @Roles('OWNER')
   @UseGuards(RolesGuard)
   @Get('/:value')
   getByValue(@Param('value') value: string) {
      return this.roleService.getRoleByValue(value)
   }
}
