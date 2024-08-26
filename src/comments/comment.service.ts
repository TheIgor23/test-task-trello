import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Comment } from './comment.entity';
import { Repository } from 'typeorm';
import { CreateCommentDto } from './dto/create-comment.dto';
import { UpdateCommentDto } from './dto/update-card.dto';

@Injectable()
export class CommentService {
    constructor(
        @InjectRepository(Comment)
        private readonly commentRepository: Repository<Comment>,
    ) {}

    async createComment(
        createCommentDto: CreateCommentDto,
        cardId: number,
        userId: number,
    ) {
        const newComment = await this.commentRepository.create({
            ...createCommentDto,
            user: { id: userId },
            card: { id: cardId },
        });
        return this.commentRepository.save(newComment);
    }

    async deleteComment(id: number, cardId: number, userId: number) {
        const comment = await this.commentRepository.findOne({
            where: { id, user: { id: userId }, card: { id: cardId } },
        });
        if (!comment) throw new NotFoundException('Comment not found');
        return this.commentRepository.remove(comment);
    }

    async updateComment(
        id: number,
        cardId: number,
        userId: number,
        updateColumnDto: UpdateCommentDto,
    ) {
        const comment = await this.commentRepository.findOne({
            where: { id, card: { id: cardId }, user: { id: userId } },
        });
        if (!comment) throw new NotFoundException('Comment not found');
        this.commentRepository.merge(comment, updateColumnDto);
        return this.commentRepository.save(comment);
    }

    getAllCommentsByCardId(cardId: number) {
        return this.commentRepository.find({
            where: { card: { id: cardId } },
        });
    }
}
