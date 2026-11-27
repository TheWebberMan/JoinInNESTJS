import { Controller, Get, Post, Patch, Delete, Body, Param, ParseIntPipe, UsePipes, ValidationPipe } from '@nestjs/common';
import { EventsService } from './events.service.js';
import { CreateEventDto } from './dto/create-event.dto.js';
import { UpdateEventDto } from './dto/update-event.dto.js';

@UsePipes(new ValidationPipe({ whitelist: true }))
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

    @Patch(':id')
    update(@Param('id', ParseIntPipe) id: number, @Body() updateEventDto: UpdateEventDto){
        return this.eventsService.update(id, updateEventDto)
    }

    @Delete(':id')
    remove(@Param('id', ParseIntPipe) id: number){
        return this.eventsService.remove(id)
    }
}
