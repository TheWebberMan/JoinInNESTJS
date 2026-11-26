
import { Body, Controller, Get, Post, Patch, Delete, Param, ParseIntPipe, ValidationPipe, UseGuards, Request } from '@nestjs/common';
import type { Request as ExpressRequest } from 'express';
import { AuthService } from './auth.service.js'
import { CreateUserDto } from "../users/dto/create-user.dto.js"
import { LoginAuthDto } from "./dto/login-auth.dto.js"
import { AuthGuard } from './guards/auth.guard.js';


@Controller('auth')
export class AuthController {
constructor(private readonly authService: AuthService) {}


@Post('login')
login(@Body(ValidationPipe) loginAuthDto: LoginAuthDto){
    return this.authService.authenticate(loginAuthDto)
}

@Post('signup')
create(@Body(ValidationPipe) createUserDto: CreateUserDto){
    return this.authService.create(createUserDto)
}

@UseGuards(AuthGuard)
@Get('me')
getUserInfo(@Request() request: ExpressRequest) {
    return request.user
        
}

}
