import {
    Body,
    ClassSerializerInterceptor,
    Controller,
    Delete,
    Get,
    HttpStatus,
    Param,
    ParseIntPipe,
    Post,
    Put,
    UseGuards,
    UseInterceptors,
} from '@nestjs/common';
import {
    ApiBearerAuth,
    ApiOperation,
    ApiParam,
    ApiResponse,
    ApiTags,
} from '@nestjs/swagger';
import { CommentService } from './comment.service';
import { CreateCommentDto } from './dto/create-comment.dto';
import { UpdateCommentDto } from './dto/update-card.dto';
import EntityExist from 'src/guards/entity-exist.guard';
import { Card } from 'src/card/card.entity';
import IsOwner from 'src/auth/guards/is-owner.guard';

@ApiParam({
    name: 'userId',
    required: true,
    description: 'User identifier',
})
@ApiParam({
    name: 'cardId',
    required: true,
    description: 'Card identifier',
})
@ApiResponse({
    status: HttpStatus.FORBIDDEN,
    description: 'User don`t have access',
})
@UseGuards(IsOwner(Card, 'cardId', 'column.owner'))
@UseGuards(EntityExist(Card, 'cardId'))
@ApiBearerAuth()
@ApiTags('Comments')
@Controller('users/:userId/cards/:cardId/comments')
@UseInterceptors(ClassSerializerInterceptor)
export class CommentController {
    constructor(private readonly commentService: CommentService) {}

    @ApiOperation({ summary: 'Get all comments by card id' })
    @ApiResponse({
        status: HttpStatus.OK,
        description: 'Success. comments founded',
        type: CreateCommentDto,
        isArray: true,
    })
    @Get()
    getAllCommentsByCardId(@Param('cardId', ParseIntPipe) cardId: number) {
        return this.commentService.getAllCommentsByCardId(cardId);
    }

    @ApiOperation({ summary: 'Create new comment' })
    @ApiResponse({
        status: HttpStatus.CREATED,
        description: 'Success. comment created',
        type: CreateCommentDto,
    })
    @ApiResponse({
        status: HttpStatus.BAD_REQUEST,
        description: 'Comment body incorrect',
    })
    @Post()
    createComment(
        @Param('cardId', ParseIntPipe) cardId: number,
        @Param('userId', ParseIntPipe) userId: number,
        @Body() createCommentDto: CreateCommentDto,
    ) {
        return this.commentService.createComment(
            createCommentDto,
            cardId,
            userId,
        );
    }

    @ApiOperation({ summary: 'Delete Comment' })
    @ApiResponse({
        status: HttpStatus.OK,
        description: 'Success. Comment deleted',
        type: CreateCommentDto,
    })
    @Delete(':commentId')
    deleteComment(
        @Param('commentId', ParseIntPipe) commentId: number,
        @Param('cardId', ParseIntPipe) cardId: number,
        @Param('userId', ParseIntPipe) userId: number,
    ) {
        return this.commentService.deleteComment(commentId, cardId, userId);
    }

    @ApiOperation({ summary: 'Update Comment' })
    @ApiResponse({
        status: HttpStatus.OK,
        description: 'Success. Comment updated',
        type: CreateCommentDto,
    })
    @ApiResponse({
        status: HttpStatus.BAD_REQUEST,
        description: 'Comment body incorrect',
    })
    @Put(':commentId')
    updateCard(
        @Param('commentId', ParseIntPipe) commentId: number,
        @Param('cardId', ParseIntPipe) cardId: number,
        @Param('userId', ParseIntPipe) userId: number,
        @Body() updateCommentDto: UpdateCommentDto,
    ) {
        return this.commentService.updateComment(
            commentId,
            cardId,
            userId,
            updateCommentDto,
        );
    }
}
