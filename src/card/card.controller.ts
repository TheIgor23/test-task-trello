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
import { CardService } from './card.service';
import { CreateCardDto } from './dto/create-card.dto';
import { IsOwner } from 'src/auth/guards/isOwner.guard';
import { UpdateCardDto } from './dto/update-card.dto';
import { CardDto } from './dto/card.dto';
import { IsColumnExist } from 'src/column/guards/is-exist.guard';

@ApiParam({
    name: 'userId',
    required: true,
    description: 'User identifier',
})
@ApiParam({
    name: 'columnId',
    required: true,
    description: 'Column identifier',
})
@ApiResponse({
    status: HttpStatus.FORBIDDEN,
    description: 'User don`t have access',
})
@UseGuards(IsColumnExist)
@ApiBearerAuth()
@ApiTags('Cards')
@Controller('users/:userId/columns/:columnId/cards')
@UseInterceptors(ClassSerializerInterceptor)
export class CardController {
    constructor(private readonly cardService: CardService) {}

    @ApiOperation({ summary: 'Get all cards by colum id' })
    @ApiResponse({
        status: HttpStatus.OK,
        description: 'Success. cards founded',
        type: CardDto,
        isArray: true,
    })
    @UseGuards(IsOwner)
    @Get()
    getAllCardByColumnId(
        @Param('userId', ParseIntPipe) userId: number,
        @Param('columnId', ParseIntPipe) columnId: number,
    ) {
        return this.cardService.getAllCardByColumnId(columnId, userId);
    }

    @ApiOperation({ summary: 'Create new card' })
    @ApiResponse({
        status: HttpStatus.CREATED,
        description: 'Success. Card created',
        type: CardDto,
    })
    @ApiResponse({
        status: HttpStatus.BAD_REQUEST,
        description: 'Title name incorrect',
    })
    @UseGuards(IsOwner)
    @Post()
    createCard(
        @Param('columnId', ParseIntPipe) columnId: number,
        @Param('userId', ParseIntPipe) userId: number,
        @Body() createCardDto: CreateCardDto,
    ) {
        return this.cardService.createCard(createCardDto, columnId, userId);
    }

    @ApiOperation({ summary: 'Delete Card' })
    @ApiResponse({
        status: HttpStatus.OK,
        description: 'Success. Card deleted',
        type: CardDto,
    })
    @UseGuards(IsOwner)
    @Delete(':cardId')
    deleteCard(
        @Param('cardId', ParseIntPipe) cardId: number,
        @Param('columnId', ParseIntPipe) columnId: number,
        @Param('userId', ParseIntPipe) userId: number,
    ) {
        return this.cardService.deleteCard(cardId, columnId, userId);
    }

    @ApiOperation({ summary: 'Update Card' })
    @ApiResponse({
        status: HttpStatus.OK,
        description: 'Success. Card updated',
        type: CardDto,
    })
    @ApiResponse({
        status: HttpStatus.BAD_REQUEST,
        description: 'Title name incorrect',
    })
    @UseGuards(IsOwner)
    @Put(':cardId')
    updateCard(
        @Param('cardId', ParseIntPipe) cardId: number,
        @Param('columnId', ParseIntPipe) columnId: number,
        @Param('userId', ParseIntPipe) userId: number,
        @Body() updateColumnDto: UpdateCardDto,
    ) {
        return this.cardService.updateCard(
            cardId,
            columnId,
            userId,
            updateColumnDto,
        );
    }
}
