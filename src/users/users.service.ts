import { Injectable, NotFoundException } from '@nestjs/common';
import { UsersRepository } from './users.repository.js';
import { User } from './users.entity.js';
import { CreateUserDto } from './dto/create-user.dto.js';

@Injectable()
export class UsersService {
constructor(
    private readonly usersRepository: UsersRepository,
  ) {}

  async findAll(): Promise<User[]> {
    return this.usersRepository.findAll();
  }

  async findOne(id: number): Promise<User> {
    const animal = await this.usersRepository.findOne(id);

    if (!animal) {
      throw new NotFoundException('User not found');
    }

    return animal;
  }

   async create(dto: CreateUserDto): Promise<User> {
    return this.usersRepository.create(dto);
  }


}
