import {HttpException, HttpStatus, Injectable} from "@nestjs/common"
import * as path from 'path'
import * as fs from 'fs'
import * as uuid from 'uuid'

export enum FileType {
   AUDIO = 'audio',
   IMAGE = 'image'
}


@Injectable()
export class FileService {

   createFile(type: FileType, file): string {
      try {
         const fileExtension = file.originalname.split('.').pop()
         const fileName = uuid.v4() + '.' + fileExtension
         const filePath = path.resolve(__dirname, '..', 'static', type)
         if (!fs.existsSync(filePath)) {
            fs.mkdirSync(filePath, {recursive: true})
         }
         fs.writeFileSync(path.resolve(filePath, fileName), file.buffer)
         return type + '/' + fileName
      } catch (e) {
         throw new HttpException(e.message, HttpStatus.INTERNAL_SERVER_ERROR)
      }
   }

   deleteFile(filePath: string): string {
      try {
         const file = path.resolve(__dirname, '..', 'static', filePath)

         fs.stat(file, function (err) {
            if (err) {
               return new HttpException({message: 'Файл не найден'}, HttpStatus.NOT_FOUND)
            }
            fs.unlinkSync(file)
         })

         return 'Файл удален'
      } catch (e) {
         throw new HttpException(e.message, HttpStatus.INTERNAL_SERVER_ERROR)
      }
   }
}