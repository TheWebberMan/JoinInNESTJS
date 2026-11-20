import { Body, Controller, Get, Post, Param, ParseIntPipe, ValidationPipe } from '@nestjs/common';
import { UsersService } from './users.service.js'
import { CreateUserDto } from "./dto/create-user.dto.js"

@Controller('users')
export class UsersController {

    constructor(private readonly usersService: UsersService) {}

    @Get()
    findAll() {
        return this.usersService.findAll()
    }

    @Get(':id')
    findOne(@Param('id', ParseIntPipe) id: number) {
        return  this.usersService.findOne(id)
    }


    @Post()
    create(@Body(ValidationPipe) createUserDto: CreateUserDto){
        return this.usersService.create(createUserDto)
    }
}
