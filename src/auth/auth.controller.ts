
import { Body, Controller, Get, Post, Patch, Delete, Param, ParseIntPipe, ValidationPipe } from '@nestjs/common';
import { AuthService } from './auth.service.js'
import { CreateUserDto } from "../users/dto/create-user.dto.js"
import { LoginAuthDto } from "./dto/login-auth.dto.js"

@Controller('auth')
export class AuthController {
constructor(private readonly authService: AuthService) {}


@Post('login')
    login(@Body(ValidationPipe) loginAuthDto: LoginAuthDto){
        return this.authService.login(loginAuthDto)
    }

@Post('signup')
    create(@Body(ValidationPipe) createUserDto: CreateUserDto){
        return this.authService.create(createUserDto)
    }

}
