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
import { ColumnService } from './column.service';
import { CreateColumnDto } from './dto/create-column.dto';
import { IsOwner } from 'src/auth/guards/isOwner.guard';
import { UpdateColumnDto } from './dto/update-column.dto';
import { ColumnDto } from './dto/column.dto';

@ApiParam({
    name: 'userId',
    required: true,
    description: 'User identifier',
})
@ApiResponse({
    status: HttpStatus.FORBIDDEN,
    description: 'User don`t have access',
})
@ApiBearerAuth()
@ApiTags('Columns')
@Controller('users/:userId/columns')
@UseInterceptors(ClassSerializerInterceptor)
export class ColumnsController {
    constructor(private readonly columnsService: ColumnService) {}

    @ApiOperation({ summary: 'Get all columns by userId' })
    @ApiResponse({
        status: HttpStatus.OK,
        description: 'Success. Columns founded',
        type: ColumnDto,
        isArray: true,
    })
    @UseGuards(IsOwner)
    @Get()
    getAllColumnsByUserId(@Param('userId', ParseIntPipe) userId: number) {
        return this.columnsService.getAllColumnsByUserId(userId);
    }

    @ApiOperation({ summary: 'Create new column' })
    @ApiResponse({
        status: HttpStatus.CREATED,
        description: 'Success. Column created',
        type: ColumnDto,
    })
    @ApiResponse({
        status: HttpStatus.BAD_REQUEST,
        description: 'Title name incorrect',
    })
    @UseGuards(IsOwner)
    @Post()
    createColumn(
        @Param('userId', ParseIntPipe) userId: number,
        @Body() createColumnDto: CreateColumnDto,
    ) {
        return this.columnsService.createColumn(createColumnDto, userId);
    }

    @ApiOperation({ summary: 'Delete column' })
    @ApiResponse({
        status: HttpStatus.OK,
        description: 'Success. Column deleted',
        type: ColumnDto,
    })
    @UseGuards(IsOwner)
    @Delete(':columnId')
    deleteColumn(
        @Param('columnId', ParseIntPipe) columnId: number,
        @Param('userId', ParseIntPipe) userId: number,
    ) {
        return this.columnsService.deleteColumn(columnId, userId);
    }

    @ApiOperation({ summary: 'Update column' })
    @ApiResponse({
        status: HttpStatus.OK,
        description: 'Success. Column updated',
        type: ColumnDto,
    })
    @ApiResponse({
        status: HttpStatus.BAD_REQUEST,
        description: 'Title name incorrect',
    })
    @UseGuards(IsOwner)
    @Put(':columnId')
    updateColumn(
        @Param('columnId', ParseIntPipe) columnId: number,
        @Param('userId', ParseIntPipe) userId: number,
        @Body() updateColumnDto: UpdateColumnDto,
    ) {
        return this.columnsService.updateColumn(
            columnId,
            userId,
            updateColumnDto,
        );
    }
}
