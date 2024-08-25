import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CardDto {
    @ApiProperty({
        description: 'Card identifier',
    })
    id: number;

    @ApiProperty({
        description: 'Card title',
        example: 'New Card',
    })
    @IsString()
    @IsNotEmpty()
    title: string;

    @ApiProperty({
        description: 'Card body',
        example: 'Some text in card...',
    })
    @IsString()
    @IsOptional()
    body: string;
}
