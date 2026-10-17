import { Injectable } from '@nestjs/common';
import { Note } from './note.entity';
import { randomUUID } from 'crypto';
import { CreateNoteDto } from './dto/create-note.dto';
import { UpdateNoteDto } from './dto/update-note.dto';

@Injectable()
export class NotesService {
    private notes: Note[] = []; // in-memory db

    findAll(): Note[] {
        return this.notes;
    }

    findOne(id: string): Note {
        const note = this.notes.find(n => n.id === id);
        if (!note) {
            throw new Error(`Note with id ${id} not found`);
        }
        return note;
    }

    create(dto: CreateNoteDto): Note {
        const now = new Date();
        const note: Note = {
            id: randomUUID(),
            ...dto,
            createdAt: now,
            updatedAt: now
        }
        this.notes.push(note);
        return note;
    }

    update(id: string, dto: UpdateNoteDto): Note {
        const note = this.findOne(id);
        Object.assign(note, dto, { updatedAt: new Date() });
        return note;
    }

    remove(id: string): void {
        const note = this.findOne(id);
        this.notes = this.notes.filter(n => n.id !== note.id);
    }
}
