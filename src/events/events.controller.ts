import { Controller, Get, Post, Body, UsePipes, ValidationPipe } from '@nestjs/common';
import { EventsService } from './events.service.js';
import { CreateEventDto } from './dto/create-event.dto.js';

@UsePipes(new ValidationPipe())
@Controller('events')
export class EventsController {

    constructor(private readonly eventsService: EventsService) {}

    @Get()
    findAll() {
        return this.eventsService.findAll()
    }

    @Post()
    create(@Body() createEventDto: CreateEventDto){
        return this.eventsService.create(createEventDto)
    }
}
