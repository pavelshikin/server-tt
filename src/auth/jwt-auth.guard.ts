import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { Observable } from "rxjs";

@Injectable()
export class JwtAuthGuard implements CanActivate {
  constructor(private jwtService: JwtService) {
  }

  canActivate(context: ExecutionContext): boolean | Promise<boolean> | Observable<boolean> {
    const req = context.switchToHttp().getRequest();
    try {
      let token;
      // token = req.cookies?.Authentication;
      token = req.headers["authorization"].split(" ")[1];

      if (!token) {
        throw new UnauthorizedException({ message: "Пользователь не авторизован" });
      }

      req.user = this.jwtService.verify(token);
      return true;

    } catch (e) {
      throw new UnauthorizedException({ message: "Пользователь не авторизован" });
    }
  }
}
