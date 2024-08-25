import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

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
