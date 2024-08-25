import {
    Body,
    ClassSerializerInterceptor,
    Controller,
    Delete,
    Get,
    HttpCode,
    HttpStatus,
    NotFoundException,
    Param,
    ParseIntPipe,
    Post,
    Put,
    UseGuards,
    UseInterceptors,
} from '@nestjs/common';
import { UserService } from './user.service';
import {
    ApiBearerAuth,
    ApiOperation,
    ApiParam,
    ApiResponse,
    ApiTags,
} from '@nestjs/swagger';
import { UserDto } from './dto/user.dto';
import { Public } from 'src/auth/decorator/public.deocorator';
import { IsOwner } from 'src/auth/guards/isOwner.guard';
import { UpdateUserDto } from './dto/update-user.dto';
import { CreateUserDto } from './dto/create-user.dto';

@ApiTags('Users')
@Controller('users')
@UseInterceptors(ClassSerializerInterceptor)
export class UserController {
    constructor(private readonly userService: UserService) {}

    @ApiOperation({ summary: 'Get user with specified id' })
    @ApiBearerAuth()
    @ApiParam({
        name: 'userId',
        required: true,
        description: 'User identifier',
    })
    @ApiResponse({
        status: HttpStatus.OK,
        description: 'Success. User founded',
        type: UserDto,
    })
    @ApiResponse({
        status: HttpStatus.NOT_FOUND,
        description: 'User not found',
    })
    @Get(':userId')
    async getUser(@Param('userId', ParseIntPipe) id: number) {
        const user = await this.userService.getUser(id);
        if (!user) throw new NotFoundException('User not found');
        return user;
    }

    @ApiOperation({ summary: 'Create user with specified id' })
    @ApiResponse({
        status: HttpStatus.CREATED,
        description: 'Success. User created',
    })
    @ApiResponse({
        status: HttpStatus.BAD_REQUEST,
        description: 'Email or password incorrect',
    })
    @Public()
    @Post()
    createUser(@Body() userDto: CreateUserDto) {
        return this.userService.createUser(userDto);
    }

    @ApiOperation({ summary: 'Get token' })
    @ApiResponse({
        status: HttpStatus.OK,
        description: 'Success.',
    })
    @ApiResponse({
        status: HttpStatus.BAD_REQUEST,
        description: 'Email or password incorrect',
    })
    @HttpCode(HttpStatus.OK)
    @Public()
    @Post('/login')
    login(@Body() userDto: CreateUserDto) {
        return this.userService.login(userDto);
    }

    @ApiOperation({ summary: 'Delete user with specified id' })
    @ApiResponse({
        status: HttpStatus.OK,
        description: 'Success. User deleted',
    })
    @ApiResponse({
        status: HttpStatus.NOT_FOUND,
        description: 'User with this id not found',
    })
    @ApiResponse({
        status: HttpStatus.FORBIDDEN,
        description: 'User don`t have access',
    })
    @ApiParam({
        name: 'userId',
        required: true,
        description: 'User identifier',
    })
    @ApiBearerAuth()
    @UseGuards(IsOwner)
    @Delete(':userId')
    deleteUser(@Param('userId', ParseIntPipe) id: number) {
        return this.userService.deleteUser(id);
    }

    @ApiResponse({
        status: HttpStatus.OK,
        description: 'Success. User updated',
    })
    @ApiResponse({
        status: HttpStatus.NOT_FOUND,
        description: 'User with this id not found',
    })
    @ApiResponse({
        status: HttpStatus.FORBIDDEN,
        description: 'User don`t have access',
    })
    @ApiResponse({
        status: HttpStatus.BAD_REQUEST,
        description: 'Email or password didn`t pass validation',
    })
    @ApiOperation({ summary: 'Update user with specified id' })
    @ApiParam({ name: 'id', required: true, description: 'User identifier' })
    @UseGuards(IsOwner)
    @Put(':userId')
    @ApiBearerAuth()
    updateUser(
        @Param('userId', ParseIntPipe) id: number,
        @Body() userDto: UpdateUserDto,
    ) {
        return this.userService.updateUser(id, userDto);
    }
}
