import { Injectable } from '@nestjs/common';
import { CreateEventDto } from './dto/create-event.dto.js';
import { EventsRepository } from './events.repository.js';
import { Event } from './events.entity.js';

@Injectable()
export class EventsService {
constructor(
    private readonly eventsRepository: EventsRepository,
  ) {}

  async findAll(): Promise<Event[]> {
    return this.eventsRepository.findAll();
  }

   async create(dto: CreateEventDto): Promise<Event> {
    return this.eventsRepository.create(dto);
  }


}