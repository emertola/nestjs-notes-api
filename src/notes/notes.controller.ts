import { Body, Controller, Delete, Get, HttpCode, HttpStatus, Param, ParseUUIDPipe, Patch, Post } from '@nestjs/common';
import { NotesService } from './notes.service';
import { CreateNoteDto } from './dto/create-note.dto';
import { UpdateNoteDto } from './dto/update-note.dto';

@Controller('notes')
export class NotesController {
    constructor(private readonly notesService: NotesService) {}

    @Get()
    findAll() {
        return this.notesService.findAll();
    }

    @Get(':id')
    findOne(@Param('id', ParseUUIDPipe) id: string) {
        return this.notesService.findOne(id);
    }

    @Post()
    create(@Body() dto: CreateNoteDto) {
        return this.notesService.create(dto);
    }

    @Patch(':id')
    update(@Param('id', ParseUUIDPipe) id: string, @Body() dto: UpdateNoteDto) {
        return this.notesService.update(id, dto);
    }

    @Delete(':id')
    @HttpCode(HttpStatus.NO_CONTENT)
    remove(@Param('id', ParseUUIDPipe) id: string) {
        return this.notesService.remove(id);
    }
}
