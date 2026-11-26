
import { Body, Controller, Get, Post, Patch, Delete, Param, ParseIntPipe, ValidationPipe } from '@nestjs/common';
import { UsersService } from '../users/users.service.js'
import { CreateUserDto } from "../users/dto/create-user.dto.js"
import { UpdateUserDto } from "../users/dto/update-user.dto.js"

@Controller('auth')
export class AuthController {

@Post()
    create(@Body(ValidationPipe) createUserDto: CreateUserDto){
        return this.usersService.create(createUserDto)
    }

}
