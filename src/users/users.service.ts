import { Injectable, NotFoundException } from '@nestjs/common';
import { UsersRepository } from './users.repository.js';
import { User } from './users.entity.js';
import { CreateUserDto } from './dto/create-user.dto.js';
import { UpdateUserDto } from './dto/update-user.dto.js';
import { UserDto } from './dto/user.dto.js';

@Injectable()
export class UsersService {
constructor(
    private readonly usersRepository: UsersRepository,
  ) {}

  async findAll(): Promise<User[]> {
    return this.usersRepository.findAll();
  }

  async findByID(id: number): Promise<User> {
    const user = await this.usersRepository.findByID(id);

    if (!user) {
      throw new NotFoundException('User not found');
    }

    return user;
  }

   async create(dto: CreateUserDto): Promise<UserDto> {
    return this.usersRepository.create(dto);
  }

  async update(
    id: number,
    dto: UpdateUserDto,
  ): Promise<UserDto> {
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
