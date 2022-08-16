import { Injectable } from "@nestjs/common";
import { ExtractJwt, Strategy } from "passport-jwt";
import { PassportStrategy } from "@nestjs/passport";
import { UsersService } from "src/users/users.service";
import { Request } from "express";


@Injectable()
export class JwtRefreshTokenStrategy extends PassportStrategy(Strategy, "jwt-refresh-token") {
  constructor(private userService: UsersService) {
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([(request: Request) => {
        return request?.cookies?.Authentication;
      }]),
      ignoreExpiration: false,
      passReqToCallback: true,
      secretOrKey: process.env.PRIVATE_KEY || "SECRET"
    });
  }

  async validate(request: Request, { _id }) {
    const refreshToken = request.cookies?.Refresh;
    const user = await this.userService.getUserIfRefreshTokenMatches(refreshToken, _id);
    return user;
  }
}
