import { Inject, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Driver } from 'neo4j-driver';
import { User } from './users.entity.js';
import { CreateUserDto } from './dto/create-user.dto.js';
import { UpdateUserDto } from './dto/update-user.dto.js';

@Injectable()
export class UsersRepository {
  constructor(
    @Inject('NEO4J_DRIVER')
    private readonly driver: Driver,
    private readonly config: ConfigService,
  ) {}

  async findAll(): Promise<User[]> {
    const session = this.driver.session({
  database: this.config.getOrThrow<string>('NEO4J_DATABASE'),
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

async findOne(id: number): Promise<User | null> {
    const session = this.driver.session({
  database: this.config.getOrThrow<string>('NEO4J_DATABASE'),
});

    try {
      const result = await session.run(
        `
        MATCH (a:User {id: $id})
        RETURN a
        `,
        { id },
      );

      if (result.records.length === 0) {
        return null;
      }

      return this.mapUser(
        result.records[0].get('a').properties,
      );
    } finally {
      await session.close();
    }
  }


async create(dto: CreateUserDto): Promise<User> {
  const session = this.driver.session({
    database: this.config.getOrThrow<string>('NEO4J_DATABASE'),
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
          id: newId,
          name: $name,
          gender: $gender,
          age: $age,
          email: $email,
          profile_standing: 'OKAY',
          created_at: datetime(),
          password: $password,
          reports: 0
        })

        RETURN a
        `,
        {
          name: dto.name,
          gender: dto.gender,
          age: dto.age,
          email: dto.email,
          password: dto.password,
        },
      );

      return created.records[0].get('a').properties;
    });

    return this.mapUser(result);
  } finally {
    await session.close();
  }
}

async update(
    id: number,
    dto: UpdateUserDto,
  ): Promise<User | null> {
    const session = this.driver.session({
    database: this.config.getOrThrow<string>('NEO4J_DATABASE'),
  });

    try {
      const properties = Object.fromEntries(
        Object.entries(dto).filter(
          ([, value]) => value !== undefined,
        ),
      );

      const result = await session.run(
        `
        MATCH (a:User {id: $id})
        SET a += $properties
        RETURN a
        `,
        { id, properties },
      );

      if (result.records.length === 0) {
        return null;
      }

      return this.mapUser(
        result.records[0].get('a').properties,
      );
    } finally {
      await session.close();
    }
  }


async delete(id: number): Promise<boolean> {
    const session = this.driver.session({
    database: this.config.getOrThrow<string>('NEO4J_DATABASE'),
  });

    try {
      const result = await session.run(
        `
        MATCH (a:User {id: $id})
        WITH a, a.id AS deletedId
        DETACH DELETE a
        RETURN deletedId
        `,
        { id },
      );

      return result.records.length > 0;
    } finally {
      await session.close();
    }
  }

private mapUser(properties: any): User {
  return {
    id: this.toNumber(properties.id),
    name: properties.name,
    gender: properties.gender,
    age: this.toNumber(properties.age),
    email: properties.email,
    profile_standing: properties.profile_standing,
    created_at: new Date(properties.created_at.toString()),
    password: properties.password,
    reports: this.toNumber(properties.reports),
  };
}

private toNumber(value: any): number {
  if (value === undefined || value === null) {
    return 0;
  }

  return typeof value === 'number' ? value : value.toNumber();
}

    
}