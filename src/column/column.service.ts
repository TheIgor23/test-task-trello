import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Col } from './column.entity';
import { Repository } from 'typeorm';
import { CreateColumnDto } from './dto/create-column.dto';
import { UpdateColumnDto } from './dto/update-column.dto';

@Injectable()
export class ColumnService {
    constructor(
        @InjectRepository(Col)
        private readonly columnRepository: Repository<Col>,
    ) {}

    async createColumn(createColumnDto: CreateColumnDto, userId: number) {
        const newColumn = await this.columnRepository.create({
            ...createColumnDto,
            owner: { id: userId },
        });
        return this.columnRepository.save(newColumn);
    }

    async deleteColumn(id: number, userId: number) {
        const column = await this.columnRepository.findOne({
            where: { id, owner: { id: userId } },
        });
        if (!column) throw new NotFoundException('Column not found');
        return this.columnRepository.remove(column);
    }

    async updateColumn(
        id: number,
        userId: number,
        updateColumnDto: UpdateColumnDto,
    ) {
        const column = await this.columnRepository.findOne({
            where: { id, owner: { id: userId } },
        });
        if (!column) throw new NotFoundException('Column not found');
        this.columnRepository.merge(column, updateColumnDto);
        return this.columnRepository.save(column);
    }

    getAllColumnsByUserId(ownerId: number) {
        return this.columnRepository.find({
            where: { owner: { id: ownerId } },
        });
    }

    getOneOrThrow(id: number, userId: number) {
        return this.columnRepository.findOneOrFail({
            where: { id, owner: { id: userId } },
        });
    }
}
