import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller.js';
import { AuthService } from './auth.service.js';
import { UsersRepository } from '../users/users.repository.js';
import { JwtModule } from '@nestjs/jwt'
import { ConfigService } from '@nestjs/config';

@Module({
  controllers: [AuthController],
  providers: [AuthService, UsersRepository],
  imports: [
    JwtModule.register({
      global: true,
      secret: 'JWT_SECRET',
      signOptions: {expiresIn: '30m'}

    })
  ]
})
export class AuthModule {}
