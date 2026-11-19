import { Module, Global } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import neo4j from 'neo4j-driver';

@Global()
@Module({
  providers: [
    {
      provide: 'NEO4J_DRIVER',
      inject: [ConfigService],
      useFactory: (config: ConfigService) => {
        return neo4j.driver(
          config.getOrThrow<string>('NEO4J_URI'),
          neo4j.auth.basic(
            config.getOrThrow<string>('NEO4J_USERNAME'),
            config.getOrThrow<string>('NEO4J_PASSWORD'),
          ),
        );
      },
    },
  ],
  exports: ['NEO4J_DRIVER'],
})
export class Neo4jModule {}
