import {
   CanActivate,
   ExecutionContext,
   HttpException,
   HttpStatus,
   Injectable,
   UnauthorizedException
} from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { Observable } from "rxjs";
import { Reflector } from "@nestjs/core";
import { ROLES_KEY } from "./roles-auth.decorator";

@Injectable()
export class RolesGuard implements CanActivate {
   constructor(private jwtService: JwtService,
      private reflector: Reflector) {
   }

   canActivate(context: ExecutionContext): boolean | Promise<boolean> | Observable<boolean> {
      const req = context.switchToHttp().getRequest();

      try {
         const requiredRoles = this.reflector.getAllAndOverride<string>(ROLES_KEY, [
            context.getHandler(),
            context.getClass()
         ]);


         if (!requiredRoles) {
            return true;
         }

         let token: any;
         // token = req.cookies?.Authentication;
         token = req.headers.authorization.split(" ")[1];

         if (!token) {
            throw new UnauthorizedException({ message: "Пользователь не авторизован" });
         }

         /*const authHeader = req.headers.authorization
         const bearer = authHeader.split(' ')[0]
         const token = authHeader.split(' ')[1]

         if (bearer !== 'Bearer' || !token) {
            throw new UnauthorizedException({message: 'Пользователь не авторизован'})
         }*/

         const user = this.jwtService.verify(token);

         req.user = user;

         return user.roles.some(role => requiredRoles.includes(role));

      } catch (e) {
         throw new HttpException("Нет доступа", HttpStatus.FORBIDDEN);
      }
   }

}
