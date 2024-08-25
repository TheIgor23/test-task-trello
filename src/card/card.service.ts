import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Card } from './card.entity';
import { Repository } from 'typeorm';
import { CreateCardDto } from './dto/create-card.dto';
import { UpdateCardDto } from './dto/update-card.dto';

@Injectable()
export class CardService {
    constructor(
        @InjectRepository(Card)
        private readonly cardRepository: Repository<Card>,
    ) {}

    async createCard(
        createCardDto: CreateCardDto,
        columnId: number,
        userId: number,
    ) {
        const newCard = await this.cardRepository.create({
            ...createCardDto,
            column: { id: columnId, owner: { id: userId } },
        });
        return this.cardRepository.save(newCard);
    }

    async deleteCard(id: number, columnId: number, userId: number) {
        const card = await this.cardRepository.findOne({
            where: { id, column: { id: columnId, owner: { id: userId } } },
        });
        if (!card) throw new NotFoundException('Card not found');
        return this.cardRepository.remove(card);
    }

    async updateCard(
        id: number,
        columnId: number,
        userId: number,
        updateColumnDto: UpdateCardDto,
    ) {
        const card = await this.cardRepository.findOne({
            where: { id, column: { id: columnId, owner: { id: userId } } },
        });
        if (!card) throw new NotFoundException('Card not found');
        this.cardRepository.merge(card, updateColumnDto);
        return this.cardRepository.save(card);
    }

    getAllCardByColumnId(columnId: number, userId: number) {
        return this.cardRepository.find({
            where: { column: { id: columnId, owner: { id: userId } } },
        });
    }
}
