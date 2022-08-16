import {HttpException, HttpStatus, Injectable} from '@nestjs/common'
import {InjectModel} from '@nestjs/mongoose'
import {Model, ObjectId} from "mongoose"
import {UsersService} from '../users/users.service'
import {Post, PostDocument} from './schemas/post.schema'
import {Category, CategoryDocument} from './schemas/category.schema'
import {CreatePostDto} from './dto/create-post.dto'
import {UpdatePostDto} from './dto/update-post.dto'


@Injectable()
export class PostService {
   constructor(@InjectModel(Post.name) private postModel: Model<PostDocument>,
               @InjectModel(Category.name) private categoryModel: Model<CategoryDocument>,
               private usersService: UsersService) {
   }

   async create(dto: CreatePostDto, user): Promise<Post> {
      const category = await this.getCategoryById(dto.categoryId)
      const post = await this.postModel.create({...dto, category: category})
      const author = await this.usersService.getUser(user._id)
      author.posts.push(post)
      await author.save()
      await post.save()
      return post
   }

   async getAll(count = 10, offset = 0): Promise<Post[]> {
      const posts = await this.postModel.find().skip(Number(offset)).limit(Number(count))
      return posts
   }

   async getOne(id): Promise<Post> {
      const post = await this.postModel.findById(id).populate('category')
      if (!post) {
         throw new HttpException('Пост не найден', HttpStatus.NOT_FOUND)
      }
      return post
   }

   async createCategory(name: string): Promise<Category> {
      const category = await this.categoryModel.create(name)
      return category
   }

   async getAllCategories(): Promise<Category[]> {
      const categories = await this.categoryModel.find()
      return categories
   }

   async getCategoryById(id): Promise<Category> {
      const category = await this.categoryModel.findById(id)
      if(!category) {
         throw new HttpException('Категория не найдена', HttpStatus.NOT_FOUND)
      }
      return category
   }

   async deletePost(id: ObjectId) {
      try {
         const post = await this.postModel.findByIdAndDelete(id)
         if (!post) {
            throw new HttpException(' Пост не найден', HttpStatus.NOT_FOUND)
         }
         const users = await this.usersService.getUsersByPost(post._id)
         if (!users) {
            throw new HttpException('Пользаватели не найден', HttpStatus.NOT_FOUND)
         }

         users.map(user => {
            user.posts = user.posts.filter(p => p != post.id)
            user.save()
         })
         return post._id
      } catch (e) {
         console.log(e)
      }
   }

   async updatePost(dto: UpdatePostDto) {
      try {
         const post = await this.postModel.findByIdAndUpdate(dto.id, {
            title: dto.title, content: dto.content}, {new: true, useFindAndModify: false}
         )
         if (!post) {
            throw new HttpException(' Пост не найден', HttpStatus.NOT_FOUND)
         }
         
         return post
      } catch (e) {
         console.log(e)
      }
   } 

   async getPostsCategory(id) {
      await this.getCategoryById(id)
      const posts = await this.postModel.find({category: id})
      return posts
   }

   async getMyPosts(user) {
      const author = await this.usersService.getUser(user._id)
      let posts = []
      for(let i = 0; i < author.posts.length; i++) {
         let post = await this.getOne(author.posts[i])
         posts.push(post)
      }
      return posts
   }




}
