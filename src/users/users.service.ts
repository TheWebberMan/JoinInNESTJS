import { Injectable, NotFoundException } from '@nestjs/common';
import { UsersRepository } from './users.repository.js';
import { User } from './users.entity.js';
import { CreateUserDto } from './dto/create-user.dto.js';
import { UpdateUserDto } from './dto/update-user.dto.js';

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

  async update(
    id: number,
    dto: UpdateUserDto,
  ): Promise<User> {
    const user = await this.usersRepository.update(id, dto);

    if (!user) {
      throw new NotFoundException(
        `User with ID ${id} not found`,
      );
    }

    return user
  }

  async delete(id: number): Promise<void> {
    const deleted = await this.usersRepository.delete(id);

    if (!deleted) {
      throw new NotFoundException(
        `User with ID ${id} not found`,
      );
    }
  }


}
