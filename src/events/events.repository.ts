import { Inject, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import neo4j, { Driver } from 'neo4j-driver';
import { Event } from './events.entity.js';
import { CreateEventDto } from './dto/create-event.dto.js';
import { UpdateEventDto } from './dto/update-event.dto.js';

@Injectable()
export class EventsRepository {
  constructor(
    @Inject('NEO4J_DRIVER')
    private readonly driver: Driver,
    private readonly config: ConfigService,
  ) {}

  async findAll(): Promise<Event[]> {
    const session = this.driver.session({
  database: this.config.getOrThrow<string>('NEO4J_DATABASE'),
});

    try {
      const result = await session.run(`
        MATCH (a:Event)
        RETURN a
      `);

      return result.records.map(record =>
        this.mapEvent(record.get('a').properties),
      );
    } finally {
      await session.close();
    }
}


async create(dto: CreateEventDto): Promise<Event> {
  const session = this.driver.session({
    database: this.config.getOrThrow<string>('NEO4J_DATABASE'),
  });

  try {
    const result = await session.executeWrite(async (tx) => {
      const created = await tx.run(
        `
        MERGE (c:Counter {name: 'Event'})
        ON CREATE SET c.value = 0
        SET c.value = c.value + 1
        WITH c.value AS newId

        CREATE (a:Event {
          id: newId,
          title: $title,
          description: $description,
          tag: $tag,
          image: $image,
          lat: $lat,
          long: $long,
          host: $host,
          date: $date,
          address: $address
        })
        RETURN a
        `,
        {
          title: dto.title,
          description: dto.description,
          tag: dto.tag,
          image: dto.image,
          lat: dto.lat,
          long: dto.long,
          host: dto.host,
          date: dto.date,
          address: dto.address,
        },
      );

      return created.records[0].get('a').properties;
    });

    return this.mapEvent(result);
  } finally {
    await session.close();
  }
}

async update(id: number, dto: UpdateEventDto): Promise<Event | null> {
  const session = this.driver.session({
    database: this.config.getOrThrow<string>('NEO4J_DATABASE'),
  });

  try {
    const result = await session.executeWrite(async (tx) => {
      const updated = await tx.run(
        `
        MATCH (a:Event {id: $id})
        SET a += $changes
        RETURN a
        `,
        {
          id: neo4j.int(id),   // ids are stored as Neo4j integers
          changes: { ...dto }, // only the fields sent in the request
        },
      );

      return updated.records[0]?.get('a').properties ?? null;
    });

    return result ? this.mapEvent(result) : null;
  } finally {
    await session.close();
  }
}

async remove(id: number): Promise<Event | null> {
  const session = this.driver.session({
    database: this.config.getOrThrow<string>('NEO4J_DATABASE'),
  });

  try {
    const result = await session.executeWrite(async (tx) => {
      const deleted = await tx.run(
        `
        MATCH (a:Event {id: $id})
        WITH a, properties(a) AS props
        DETACH DELETE a
        RETURN props
        `,
        {
          id: neo4j.int(id),
        },
      );

      return deleted.records[0]?.get('props') ?? null;
    });

    return result ? this.mapEvent(result) : null;
  } finally {
    await session.close();
  }
}

private mapEvent(properties: any): Event {
    return {
      ...properties,
      id: properties.id?.toNumber?.() ?? properties.id,
    };
  }

    
}
