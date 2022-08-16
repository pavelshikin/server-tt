import {Body, Delete, Get, Param, Post, Query, Req, UploadedFiles, UseGuards, UseInterceptors} from "@nestjs/common"
import {Controller} from "@nestjs/common"
import {TrackService} from "./track.service"
import {CreateTrackDto} from "./dto/create-track.dto"
import {ObjectId} from "mongoose"
import {CreateCommentDto} from "./dto/create-comment.dto"
import {FileFieldsInterceptor} from "@nestjs/platform-express"
import {Roles} from '../auth/roles-auth.decorator'
import {RolesGuard} from '../auth/roles.guard'
import {JwtAuthGuard} from '../auth/jwt-auth.guard'
import {Request} from 'express'
import RequestWithUser from '../auth/requestWithUser.interface'


@Controller('/tracks')
export class TrackController {
   constructor(private trackService: TrackService) {
   }

   @Roles('OWNER' || 'ADMIN')
   @UseGuards(RolesGuard)
   @Post()
   @UseInterceptors(FileFieldsInterceptor([
      {name: 'picture', maxCount: 1},
      {name: 'audio', maxCount: 1}
   ]))
   create(@UploadedFiles() files, @Body() dto: CreateTrackDto,
          @Req() req: RequestWithUser) {
      const {picture, audio} = files
      return this.trackService.create(dto, picture[0], audio[0], req.user)
   }

   @UseGuards(JwtAuthGuard)
   @Get()
   getAll(@Query('count') count: number,
          @Query('offset') offset: number) {
      return this.trackService.getAll(count, offset)
   }

   @UseGuards(JwtAuthGuard)
   @Get('/search')
   search(@Query('query') query: string) {
      return this.trackService.search(query)
   }

   @UseGuards(JwtAuthGuard)
   @Get(':id')
   getOne(@Param('id') id: ObjectId) {
      return this.trackService.getOne(id)
   }

   @UseGuards(JwtAuthGuard)
   @Get('/add/:trackId')
   addTrack(@Param('trackId') trackId: ObjectId,
            @Req() req: Request) {
      return this.trackService.addTrack(trackId, req.user)
   }

   @Roles('OWNER' || 'ADMIN')
   @UseGuards(RolesGuard)
   @Delete(':id')
   delete(@Param('id') id: ObjectId) {
      return this.trackService.delete(id)
   }

   @UseGuards(JwtAuthGuard)
   @Post('/comment')
   addComment(@Body() dto: CreateCommentDto,
              @Req() req: RequestWithUser) {
      return this.trackService.addComment(dto, req.user)
   }

   @UseGuards(JwtAuthGuard)
   @Post('/listen/:id')
   listen(@Param('id') id: ObjectId) {
      return this.trackService.listen(id)
   }

   @Roles('OWNER' || 'ADMIN')
   @UseGuards(RolesGuard)
   @Delete(':trackId/comment/:id')
   deleteComment(@Param('id') commentId: ObjectId,
                 @Param('trackId') trackId: ObjectId) {
      return this.trackService.deleteCommentInTrack(commentId, trackId)
   }
}