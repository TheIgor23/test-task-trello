import { ApiProperty } from '@nestjs/swagger';
import { Exclude } from 'class-transformer';
import { IsNotEmpty, IsString } from 'class-validator';
import { UserDto } from 'src/user/dto/user.dto';

export class ColumnDto {
    @ApiProperty({
        description: 'Column identifier',
    })
    id: number;

    @ApiProperty({
        description: 'Column title',
        example: 'New column',
    })
    @IsString()
    @IsNotEmpty()
    title: string;
}
