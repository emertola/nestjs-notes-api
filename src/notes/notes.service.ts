import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateNoteDto } from './dto/create-note.dto';
import { UpdateNoteDto } from './dto/update-note.dto';
import { PrismaService } from '../prisma/prisma.service';
import { Note } from '../generated/prisma/client';

@Injectable()
export class NotesService {
  constructor(private readonly prisma: PrismaService) {}

  findAll(): Promise<Note[]> {
    return this.prisma.note.findMany({ orderBy: { createdAt: 'desc' } });
  }

  async findOne(id: number): Promise<Note> {
    const note = await this.prisma.note.findUnique({ where: { id } });
    if (!note) throw new NotFoundException(`Note with id ${id} not found`);
    return note;
  }

  create(dto: CreateNoteDto): Promise<Note> {
    return this.prisma.note.create({ data: dto });
  }

  async update(id: number, dto: UpdateNoteDto): Promise<Note> {
    await this.findOne(id);
    return this.prisma.note.update({ where: { id }, data: dto });
  }

  async remove(id: number): Promise<Note> {
    await this.findOne(id);
    return this.prisma.note.delete({ where: { id } });
  }
}
