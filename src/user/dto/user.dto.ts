import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, MaxLength, MinLength } from 'class-validator';

export class UserDto {
    @ApiProperty({ description: 'user identifier' })
    id: number;

    @ApiProperty({
        example: 'user@mail.com',
        description: 'Email of user',
    })
    @IsEmail()
    @MaxLength(255)
    @IsNotEmpty()
    email: string;

    @ApiProperty({
        description: 'Password of user',
        example: 'Pass123',
    })
    @MinLength(4, {
        message: 'password too short',
    })
    @MaxLength(20, {
        message: 'password too long',
    })
    @IsNotEmpty()
    password: string;
}
