import {HttpException, HttpStatus, Injectable} from '@nestjs/common'
import {InjectModel} from "@nestjs/mongoose";
import {CreateUserDto} from './dto/create-user.dto'
import {RolesService} from '../roles/roles.service'
import {AddRoleDto} from './dto/add-role.dto'
import {BanUserDto} from './dto/ban-user.dto'
import {User, UserDocument} from './schemas/user.schema';
import {Model, ObjectId} from "mongoose"
import * as bcrypt from 'bcryptjs'

@Injectable()
export class UsersService {

   constructor(@InjectModel(User.name) private userModel: Model<UserDocument>,
               private roleService: RolesService) {
   }

   async createUser(dto: CreateUserDto) {
      const user = await this.userModel.create(dto)
      const role = await this.roleService.getRoleByValue('USER')
      if (role && user) {
         user.roles.push(role.value)
         role.users.push(user._id)
         await user.save()
         await role.save()
         return user
      }
      throw new HttpException('Роль не найдена', HttpStatus.NOT_FOUND)
   }

   async updateRefreshToken(userId: ObjectId, refreshToken) {
      const token = await bcrypt.hash(refreshToken, 10)
      await this.userModel.findByIdAndUpdate(userId, {
         currentHashedRefreshToken: token}, {new: true, useFindAndModify: false})
   }

   async getUserIfRefreshTokenMatches(refreshToken: string, userId: ObjectId){
      const user = await this.getUser(userId)
      const isRefreshTokenMatching = await bcrypt.compare(
         refreshToken,
         user.currentHashedRefreshToken
      );

      if (isRefreshTokenMatching) {
         return user;
      }
   }

   async removeRefreshToken(userId: ObjectId) {
      return this.userModel.findByIdAndUpdate(userId, {
         currentHashedRefreshToken: null}, {new: true, useFindAndModify: false}
      )
   }

   async getAllUsers() {
      const users = await this.userModel.find({}, ['_id', 'roles', 'username']);
      console.log(users);
      return users
   }

   async getUser(id: ObjectId) {
      const user = await this.userModel.findById(id)
      if (!user) {
         throw new HttpException('Пользователь не найден', HttpStatus.NOT_FOUND)
      }
      return user
   }

   async getMe(user) {
      const me = await this.userModel.findById(user._id)
      return {
         _id: me._id,
         username: me.username,
         roles: me.roles
      }
   }

   async deleteUser(id: ObjectId) {
      const user = await this.userModel.findByIdAndDelete(id)
      if (!user) {
         throw new HttpException('Пользователь не найден', HttpStatus.NOT_FOUND)
      }
      return {message: 'Пользователь удален'}
   }

   async getUserByEmail(email: string) {
      const user = await this.userModel.findOne({email})
      return user
   }

   async getUsersByTrack(trackId) {
      const users = await this.userModel.find({tracks: trackId})
      return users
   }

   async getUsersByPost (id) {
      const users = await this.userModel.find({posts: id})
      return users
   }

   async addRole(dto: AddRoleDto) {
      const user = await this.userModel.findById(dto.userId)
      const role = await this.roleService.getRoleByValue(dto.value)
      if (role && user) {
         user.roles.push(role.value)
         role.users.push(user._id)
         await user.save()
         await role.save()
         return role
      }
      throw new HttpException('Пользователь или роль не найдены', HttpStatus.NOT_FOUND)
   }

   async ban(dto: BanUserDto) {
      const user = await this.userModel.findById(dto.userId)
      if (!user) {
         throw new HttpException('Пользователь не найден', HttpStatus.NOT_FOUND)
      }
      user.banned = true
      user.banReason = dto.banReason
      await user.save()
      return user
   }
}
