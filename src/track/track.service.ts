import {HttpException, HttpStatus, Injectable} from "@nestjs/common"
import {InjectModel} from "@nestjs/mongoose"
import {Track, TrackDocument} from "./schemas/track.schema"
import {Model, ObjectId} from "mongoose"
import {Comment, CommentDocument} from "./schemas/comment.schema"
import {CreateTrackDto} from "./dto/create-track.dto"
import {CreateCommentDto} from "./dto/create-comment.dto"
import {FileService, FileType} from "../file/file.service"
import {UsersService} from '../users/users.service'


@Injectable()
export class TrackService {

   constructor(@InjectModel(Track.name) private trackModel: Model<TrackDocument>,
               @InjectModel(Comment.name) private commentModel: Model<CommentDocument>,
               private usersService: UsersService,
               private fileService: FileService) {
   }

   async create(dto: CreateTrackDto, picture, audio, user): Promise<Track> {
      const audioPath = this.fileService.createFile(FileType.AUDIO, audio)
      const picturePath = this.fileService.createFile(FileType.IMAGE, picture)
      const track = await this.trackModel.create({...dto, listens: 0, audio: audioPath, picture: picturePath})
      const author = await this.usersService.getUser(user._id)
      author.tracks.push(track)
      await author.save()
      return track
   }

   async getAll(count = 10, offset = 0): Promise<Track[]> {
      const tracks = await this.trackModel.find().skip(Number(offset)).limit(Number(count))
      return tracks
   }

   async getOne(id: ObjectId): Promise<Track> {
      const track = await this.trackModel.findById(id).populate('comments')
      if (!track) {
         throw new HttpException('Трек не найден', HttpStatus.NOT_FOUND)
      }
      return track
   }

   async addTrack(trackId: ObjectId, user): Promise<Track> {
      const author = await this.usersService.getUser(user._id)
      const track = await this.trackModel.findById(trackId)
      if (!track) {
         throw new HttpException('Трек не найден', HttpStatus.NOT_FOUND)
      }

      author.tracks.push(track._id)
      await author.save()

      return track
   }


   async delete(id: ObjectId): Promise<ObjectId> {
      try {
         const track = await this.trackModel.findByIdAndDelete(id)
         if (!track) {
            throw new HttpException('Трек не найден', HttpStatus.NOT_FOUND)
         }
         const users = await this.usersService.getUsersByTrack(id)
         if (!users) {
            throw new HttpException('Пользаватели не найден', HttpStatus.NOT_FOUND)
         }

         users.map(user => {
            user.tracks = user.tracks.filter(t => t != track.id)
            user.save()
         })

         for (let i = 0; i < track.comments.length; i++) {
            this.deleteComment(track.comments[i])
         }

         this.fileService.deleteFile(track.audio)
         this.fileService.deleteFile(track.picture)

         return track._id
      } catch (e) {
         console.log(e)
      }
   }

   async addComment(dto: CreateCommentDto, user): Promise<Comment> {
      const track = await this.trackModel.findById(dto.trackId)
      if (!track) {
         throw new HttpException('Трек не найден', HttpStatus.NOT_FOUND)
      }

      const author = await this.usersService.getUser(user._id)
      const username = author.username
      const userId = author._id

      const comment = await this.commentModel.create({...dto, username, userId})
      track.comments.push(comment._id)
      await track.save()
      return comment
   }

   async listen(id: ObjectId) {
      const track = await this.trackModel.findById(id)
      track.listens += 1
      await track.save()
   }

   async search(query: string): Promise<Track[]> {
      const tracks = await this.trackModel.find({
         name: {$regex: new RegExp(query, 'i')}
      })
      return tracks
   }

   private async deleteComment(commentId) {
      try {
         const comment = await this.commentModel.findByIdAndDelete(commentId)
         if (!comment) {
            throw new HttpException('Комментарий не найден', HttpStatus.NOT_FOUND)
         }
         return comment._id
      } catch (e) {
         console.log(e)
      }
   }

   async deleteCommentInTrack(commentId: ObjectId, trackId) {
      try {
         const id = await this.deleteComment(commentId)

         const track = await this.trackModel.findById(trackId)
         if (!track) {
            throw new HttpException('Трек не найден', HttpStatus.NOT_FOUND)
         }

         track.comments = track.comments.filter(comment => comment != id)
         await track.save()

         return {message: `Комментарий ${commentId} удален`}

      } catch (e) {
         console.log(e)
      }
   }
}