import { Body, Controller, Get, Post, Patch, Delete, Param, ParseIntPipe, ValidationPipe, UseGuards, Request } from '@nestjs/common';
import { UsersService } from './users.service.js'
import { CreateUserDto } from "./dto/create-user.dto.js"
import { UpdateUserDto } from "./dto/update-user.dto.js"
import { AuthGuard } from '../auth/guards/auth.guard.js';

@Controller('users')
export class UsersController {

    constructor(private readonly usersService: UsersService) {}

    @Get()
    findAll() {
        return this.usersService.findAll()
    }
    @Get(':id')
    findByID(@Param('id', ParseIntPipe) id: number) {
        return  this.usersService.findByID(id)
    }


    @Post()
    create(@Body(ValidationPipe) createUserDto: CreateUserDto){
        return this.usersService.create(createUserDto)
    }

    @Patch(':id')
    update(@Param('id', ParseIntPipe) id: number, @Body(ValidationPipe) userUpdateDto: UpdateUserDto) {
        return  this.usersService.update(id, userUpdateDto)
    }

    @Delete(':id')
    delete(@Param('id', ParseIntPipe) id: number) {
        return  this.usersService.delete(id)
    }
}
