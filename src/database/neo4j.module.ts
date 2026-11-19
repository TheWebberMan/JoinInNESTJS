import { Module, Global } from '@nestjs/common';
import neo4j from 'neo4j-driver';

@Global()
@Module({
  providers: [
    {
      provide: 'NEO4J_DRIVER',
      useFactory: () => {
        return neo4j.driver(
          'neo4j://127.0.0.1:7687',
          neo4j.auth.basic(
            'neo4j',
            '12345678',
          ),
        );
      },
    },
  ],
  exports: ['NEO4J_DRIVER'],
})
export class Neo4jModule {}