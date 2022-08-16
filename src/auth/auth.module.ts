import {forwardRef, Module} from '@nestjs/common'
import {AuthController} from './auth.controller'
import {AuthService} from './auth.service'
import {JwtModule} from '@nestjs/jwt'
import {UsersModule} from "../users/users.module"
import {JwtRefreshTokenStrategy} from './jwt-refresh-token.strategy'
import { PassportModule } from '@nestjs/passport';


@Module({
    controllers: [AuthController],
    providers: [AuthService, JwtRefreshTokenStrategy],
    imports: [
        forwardRef(() => UsersModule),
        JwtModule.register({
            secret: process.env.PRIVATE_KEY || 'SECRET',
            signOptions: {
                expiresIn: '24h'
            }
        }),
        PassportModule.register({ defaultStrategy: 'jwt-refresh-token' }),
    ],
    exports: [
        AuthService,
        JwtModule,
        JwtRefreshTokenStrategy
    ]
})

export class AuthModule {}
