import { Injectable, ConflictException, UnauthorizedException } from '@nestjs/common';
import { UsersRepository } from '../users/users.repository.js';
import { User } from '../users/users.entity.js';
import { CreateUserDto } from '../users/dto/create-user.dto.js';
import { UserDto } from '../users/dto/user.dto.js';
import { LoginAuthDto } from "./dto/login-auth.dto.js"
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
constructor(
    private readonly usersRepository: UsersRepository,
    ) {}

async login(dto: LoginAuthDto): Promise<UserDto> {
  const user = await this.usersRepository.findByEmail(dto.email);

    if (!user) {
    throw new UnauthorizedException('Invalid email or password');
  }

   const isPasswordValid = await bcrypt.compare(
    dto.password,
    user.password,
  );

  console.log(isPasswordValid)

  if (!isPasswordValid) {
    throw new UnauthorizedException('Invalid email or password');
  }

   return {
    id: user.id,
    name: user.name,
    gender: user.gender,
    age: user.age,
    email: user.email,
  };

}


async create(dto: CreateUserDto): Promise<User> {
  if (await this.usersRepository.userExists(dto.email)) {
    throw new ConflictException('A user with this email already exists');
  }

  const salt = bcrypt.genSaltSync()
  const hashedPassword = bcrypt.hashSync(dto.password, salt)
  dto.password = hashedPassword
  
    return this.usersRepository.create(dto);
  }
}
