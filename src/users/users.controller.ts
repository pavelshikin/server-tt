import {Body, Controller, Delete, Get, Param, Post, Req, UseGuards} from '@nestjs/common'
import {UsersService} from './users.service'
import {Roles} from '../auth/roles-auth.decorator'
import {RolesGuard} from '../auth/roles.guard'
import {AddRoleDto} from './dto/add-role.dto'
import {BanUserDto} from './dto/ban-user.dto'
import {ObjectId} from "mongoose"
import {JwtAuthGuard} from '../auth/jwt-auth.guard'
import {Request} from 'express'


@Controller('users')
export class UsersController {

   constructor(private userService: UsersService) {}

   @Roles('OWNER')
   @UseGuards(RolesGuard)
   @Get()
   getAll() {
      return this.userService.getAllUsers()
   }

   @UseGuards(JwtAuthGuard)
   @Get('/:id')
   getUser(@Param('id') id: ObjectId) {
      return this.userService.getUser(id)
   }

   @UseGuards(JwtAuthGuard)
   @Post('/me')
   getMe(@Req() req: Request) {
      return this.userService.getMe(req.user)
   }

   @Roles('OWNER')
   @UseGuards(RolesGuard)
   @Delete('/:id')
   delete(@Param('id') id: ObjectId) {
      return this.userService.deleteUser(id)
   }

   @Roles('OWNER')
   @UseGuards(RolesGuard)
   @Post('/role')
   addRole(@Body() dto: AddRoleDto) {
      return this.userService.addRole(dto)
   }

   @Roles('OWNER' || 'ADMIN')
   @UseGuards(RolesGuard)
   @Post('/ban')
   ban(@Body() dto: BanUserDto) {
      return this.userService.ban(dto)
   }
}
