import { Inject, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Driver } from 'neo4j-driver';
import { Event } from './events.entity.js';
import { CreateEventDto } from './dto/create-event.dto.js';

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
          titel: $titel,
          beskrivelse: $beskrivelse,
          tag: $tag,
          billede: $billede,
          lat: $lat,
          long: $long,
          host: $host,
          dato: $dato,
          adresse: $adresse
        })
        RETURN a
        `,
        {
          titel: dto.titel,
          beskrivelse: dto.beskrivelse,
          tag: dto.tag,
          billede: dto.billede,
          lat: dto.lat,
          long: dto.long,
          host: dto.host,
          dato: dto.dato,
          adresse: dto.adresse,
        },
      );

      return created.records[0].get('a').properties;
    });

    return this.mapEvent(result);
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
