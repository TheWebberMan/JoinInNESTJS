import { Injectable, ConflictException, UnauthorizedException } from '@nestjs/common';
import { UsersRepository } from '../users/users.repository.js';
import { User } from '../users/users.entity.js';
import { CreateUserDto } from '../users/dto/create-user.dto.js';
import { UserDto } from '../users/dto/user.dto.js';
import { LoginAuthDto } from "./dto/login-auth.dto.js"
import { JwtService } from "@nestjs/jwt"
import * as bcrypt from 'bcrypt';

type AuthResult = { accesToken: string; userID: number; username: string}

@Injectable()
export class AuthService {
constructor(
    private readonly usersRepository: UsersRepository,
    private jwtService: JwtService
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

//TODO EDIT USER AND USERDTO
//TODO REMOVE ONE VALIDATION
//TODO COMBINE AUTHENTICATE AND LOGIN
//TODO JWT SECRET IN .ENV
async authenticate(dto: LoginAuthDto): Promise<AuthResult> {
  const user = this.usersRepository.userExists(dto.email)
  if (!user) {
    throw new ConflictException('A user with this email already exists');
  }

  const validatedUser = await this.usersRepository.findByEmail(dto.email)


  if(!validatedUser){
    throw new ConflictException('A user with this email already exists');
  }
  return this.signIn(dto)
  
}

async signIn(dto: LoginAuthDto): Promise<AuthResult>{
  const validatedUser = await this.usersRepository.findByEmail(dto.email)
  if(!validatedUser){
    throw new ConflictException('A user with this email already exists');
  }
  const tokenPayload ={
    sub: validatedUser.id,
    username: validatedUser.name
  }

  const accesToken = await this.jwtService.signAsync(tokenPayload)

  return {accesToken, username: validatedUser.name, userID: validatedUser.id}
}




async create(dto: CreateUserDto): Promise<UserDto> {
  if (await this.usersRepository.userExists(dto.email)) {
    throw new ConflictException('A user with this email already exists');
  }

  const salt = bcrypt.genSaltSync()
  const hashedPassword = bcrypt.hashSync(dto.password, salt)
  dto.password = hashedPassword
  
    return this.usersRepository.create(dto);
  }
}
