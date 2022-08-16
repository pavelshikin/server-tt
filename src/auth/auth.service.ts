import { HttpException, HttpStatus, Injectable, UnauthorizedException } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { CreateUserDto } from "../users/dto/create-user.dto";
import { UsersService } from "../users/users.service";
import * as bcrypt from "bcryptjs";
import { LoginUserDto } from "../users/dto/login-user.dto";


@Injectable()
export class AuthService {

  constructor(private userService: UsersService,
              private jwtService: JwtService) {
  }

  async login(userDto: LoginUserDto) {
    const user = await this.validateUser(userDto);
    const { token, tokenCookie } = await this.generateToken(user);
    const { refreshToken, refreshTokenCookie } = await this.generateRefreshToken(user);
    return { token, tokenCookie, refreshToken, refreshTokenCookie, userId: user._id };

  }

  public async getCookieWithJwtAccessToken(authUser) {
    const user = await this.userService.getUser(authUser._id);
    const { token, tokenCookie } = await this.generateToken(user);
    return { token, tokenCookie };
  }

  async registration(userDto: CreateUserDto) {
    const candidate = await this.userService.getUserByEmail(userDto.email);
    if (candidate) {
      throw new HttpException("Пользователь с таким email существует", HttpStatus.BAD_REQUEST);
    }
    const hashPassword = await bcrypt.hash(userDto.password, 10);
    const user = await this.userService.createUser({ ...userDto, password: hashPassword });
    const { token, tokenCookie } = await this.generateToken(user);
    const { refreshToken, refreshTokenCookie } = await this.generateRefreshToken(user);
   return { token, tokenCookie, refreshToken, refreshTokenCookie, userId: user._id }; 
 }

  private async generateToken(user) {
    const payload = { email: user.email, _id: user._id, roles: user.roles };
    const token = await this.jwtService.sign(payload);
    return {
      token: token,
      tokenCookie: `Authentication=${token};HttpOnly;Path=/;Max-Age=604800;SameSite=None;Secure`
    };
  }

  private async generateRefreshToken(user) {
    const payload = { email: user.email, _id: user._id, roles: user.roles };
    const token = await this.jwtService.sign(payload, {
      secret: process.env.REFRESH_PRIVATE_KEY || "REFRESH_SECRET_KEY"
    });
    return {
      refreshToken: token,
      refreshTokenCookie: `Refresh=${token};HttpOnly;Path=/;Max-Age=604800;SameSite=None;Secure`
    };
  }

  async setCurrentRefreshToken(refreshToken, userEmail: string) {
    const user = await this.userService.getUserByEmail(userEmail);
    await this.userService.updateRefreshToken(user._id, refreshToken);
  }


  private async validateUser(userDto: LoginUserDto) {
    const user = await this.userService.getUserByEmail(userDto.email);
    if (!user) {
      throw new UnauthorizedException({ message: "Неверный email или пароль" });
    }
    const passwordEquals = await bcrypt.compare(userDto.password, user.password);
    if (user && passwordEquals) {
      return user;
    }
    throw new UnauthorizedException({ message: "Неверный email или пароль" });
  }

  public static getCookiesForLogOut() {
    return [
      "Authentication=; HttpOnly; Path=/; Max-Age=0",
      "Refresh=; HttpOnly; Path=/; Max-Age=0",
      "token=;  ; Path=/; Max-Age=0"
    ];
  }

  async deleteRefreshToken(user) {
    await this.userService.removeRefreshToken(user._id);
  }

}
