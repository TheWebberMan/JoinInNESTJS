import { Injectable } from '@nestjs/common';
import { UsersRepository } from '../users/users.repository.js';
import { User } from '../users/users.entity.js';
import { CreateUserDto } from '../users/dto/create-user.dto.js';
import { UpdateUserDto } from '../users/dto/update-user.dto.js';
@Injectable()
export class AuthService {

    constructor(
        private readonly usersRepository: UsersRepository,
      ) {}
}
