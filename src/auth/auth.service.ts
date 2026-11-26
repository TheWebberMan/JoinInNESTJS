import { Injectable, ConflictException, UnauthorizedException } from '@nestjs/common';
import { UsersRepository } from '../users/users.repository.js';
import { User } from '../users/users.entity.js';
import { CreateUserDto } from '../users/dto/create-user.dto.js';
import { UserDto } from '../users/dto/user.dto.js';
import { LoginAuthDto } from "./dto/login-auth.dto.js"
import { JwtService } from "@nestjs/jwt"
import * as bcrypt from 'bcrypt';

type AuthResult = { accesToken: string; id: number; email: string, name: string} // THIS PART IS RETURNED WHEN THE USER LOGS IN

@Injectable()
export class AuthService {
constructor(
    private readonly usersRepository: UsersRepository,
    private jwtService: JwtService
    ) {}


async authenticate(dto: LoginAuthDto): Promise<AuthResult> {

  const user = await this.usersRepository.findByEmail(dto.email)
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

  return this.signIn(dto)
  
}

async signIn(dto: LoginAuthDto): Promise<AuthResult>{
  const user = await this.usersRepository.findByEmail(dto.email)
  if(!user){
    throw new ConflictException('A user with this email already exists');
  }
  
  const tokenPayload ={ // THIS PART IS SAVED IN THE JWT
    sub: user.id,
    name: user.name,
    email:user.email
  }

  const accesToken = await this.jwtService.signAsync(tokenPayload)

  return {accesToken,  id: user.id, email: user.email, name: user.name,}
}




async create(dto: CreateUserDto): Promise<UserDto> {
  if (await this.usersRepository.userExistsByEmail(dto.email)) {
    throw new ConflictException('A user with this email already exists');
  }

  if (await this.usersRepository.userExistsByName(dto.name)) {
    throw new ConflictException('A user with this username already exists');
  }

  const salt = bcrypt.genSaltSync()
  const hashedPassword = bcrypt.hashSync(dto.password, salt)
  dto.password = hashedPassword
  
    return this.usersRepository.create(dto);
  }
}
