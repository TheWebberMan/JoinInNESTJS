import { Inject, Injectable } from '@nestjs/common';
import neo4j, { Driver } from 'neo4j-driver';
import { User } from './users.entity.js';
import { CreateUserDto } from './dto/create-user.dto.js';

@Injectable()
export class UsersRepository {
  constructor(
    @Inject('NEO4J_DRIVER')
    private readonly driver: Driver,
  ) {}

  async findAll(): Promise<User[]> {
    const session = this.driver.session({
  database: 'joinin',
});

    try {
      const result = await session.run(`
        MATCH (a:User)
        RETURN a
      `);

      return result.records.map(record =>
        this.mapUser(record.get('a').properties),
      );
    } finally {
      await session.close();
    }
}


async create(dto: CreateUserDto): Promise<User> {
  const session = this.driver.session({
    database: 'joinin',
  });

  try {
    const result = await session.executeWrite(async (tx) => {
      const created = await tx.run(
        `
        MERGE (c:Counter {name: 'User'})
        ON CREATE SET c.value = 0
        SET c.value = c.value + 1
        WITH c.value AS newId

        CREATE (a:User {
          name: $name
        })
        RETURN a
        `,
        {
          name: dto.name,
        },
      );

      return created.records[0].get('a').properties;
    });

    return this.mapUser(result);
  } finally {
    await session.close();
  }
}
private mapUser(properties: any): User {
    return {
      ...properties,
    };
  }

    
}