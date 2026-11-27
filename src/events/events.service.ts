import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateEventDto } from './dto/create-event.dto.js';
import { UpdateEventDto } from './dto/update-event.dto.js';
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

  async update(id: number, dto: UpdateEventDto): Promise<Event> {
    const event = await this.eventsRepository.update(id, dto);
    if (!event) {
      throw new NotFoundException(`Event with id ${id} not found`);
    }
    return event;
  }

  async remove(id: number): Promise<Event> {
    const event = await this.eventsRepository.remove(id);
    if (!event) {
      throw new NotFoundException(`Event with id ${id} not found`);
    }
    return event;
  }


}
