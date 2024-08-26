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
import { UpdateCardDto } from './dto/update-card.dto';
import { CardDto } from './dto/card.dto';
import EntityExist from 'src/guards/entity-exist.guard';
import { Col } from 'src/column/column.entity';
import IsOwner from 'src/auth/guards/is-owner.guard';

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
@ApiBearerAuth()
@ApiTags('Cards')
@UseGuards(IsOwner(Col, 'columnId', 'owner'))
@UseGuards(EntityExist(Col, 'columnId'))
@Controller('users/:userId/columns/:columnId/cards')
@UseInterceptors(ClassSerializerInterceptor)
export class CardController {
    constructor(private readonly cardService: CardService) {}

    @ApiOperation({ summary: 'Get all cards by column id' })
    @ApiResponse({
        status: HttpStatus.OK,
        description: 'Success. cards founded',
        type: CardDto,
        isArray: true,
    })
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
        description: 'Title incorrect',
    })
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
        description: 'Title incorrect',
    })
    @Put(':cardId')
    updateCard(
        @Param('cardId', ParseIntPipe) cardId: number,
        @Param('columnId', ParseIntPipe) columnId: number,
        @Param('userId', ParseIntPipe) userId: number,
        @Body() updateCardDto: UpdateCardDto,
    ) {
        return this.cardService.updateCard(
            cardId,
            columnId,
            userId,
            updateCardDto,
        );
    }
}
