import { Module } from '@nestjs/common';
import { AppController } from './app.controller.js';
import { AppService } from './app.service.js';
import { Neo4jModule } from './database/neo4j.module.js';
import { UsersModule } from './users/users.module.js';

@Module({
  imports: [
    Neo4jModule,
    UsersModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
