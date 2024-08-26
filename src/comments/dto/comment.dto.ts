import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';
import { UserDto } from 'src/user/dto/user.dto';

export class CommentDto {
    @ApiProperty({
        description: 'Comment identifier',
    })
    id: number;

    @ApiProperty({
        description: 'Comment text',
        example: 'some comment...',
    })
    @IsNotEmpty()
    body: string;

    @ApiProperty({
        description: 'User, that post the comment',
    })
    user: UserDto;
}
