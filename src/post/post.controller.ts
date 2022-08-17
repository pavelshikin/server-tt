import {Body, Delete, Get, Put, Param, Post, Query, Req, UploadedFiles, UseGuards, UseInterceptors} from "@nestjs/common"
import {Controller} from "@nestjs/common"
import {PostService} from "./post.service"
import {ObjectId} from "mongoose"
import {Roles} from '../auth/roles-auth.decorator'
import {RolesGuard} from '../auth/roles.guard'
import {JwtAuthGuard} from '../auth/jwt-auth.guard'
import {Request} from 'express'
import RequestWithUser from '../auth/requestWithUser.interface'
import {CreatePostDto} from './dto/create-post.dto'
import {UpdatePostDto} from './dto/update-post.dto'


@Controller('/posts')
export class PostController {
   constructor(private postService: PostService) {}

   @UseGuards(JwtAuthGuard)
   @Post()
   create(@Body() dto: CreatePostDto,
          @Req() req: RequestWithUser) {
      return this.postService.create(dto, req.user)
   }

   @UseGuards(JwtAuthGuard)
   @Get()
   getAll(@Query('count') count: number,
          @Query('offset') offset: number) {
      return this.postService.getAll(count, offset)
   }

   @UseGuards(JwtAuthGuard)
   @Get('/me')
   getMyPosts(@Req() req: Request) {
      return this.postService.getMyPosts(req.user)
   }

   @Roles('OWNER')
   @UseGuards(RolesGuard)
   @Post('/category')
   createCategory(@Body() name: string) {
      return this.postService.createCategory(name)
   }

   @UseGuards(JwtAuthGuard)
   @Delete(':id')
   delete(@Param('id') id: ObjectId) {
      return this.postService.deletePost(id)
   }

   @Roles('OWNER', 'ADMIN')
   @UseGuards(RolesGuard)
   @Get('/category/:id')
   getPostsCategory(@Param('id') id: ObjectId) {
      return this.postService.getPostsCategory(id)
   }

   @UseGuards(JwtAuthGuard)
   @Put()
   update(@Body() dto: UpdatePostDto) {
      return this.postService.updatePost(dto)
   }


}
