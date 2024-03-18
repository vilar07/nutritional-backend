// users.dto.ts
import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsNotEmpty, isArray } from 'class-validator';

    export class CreateUserDto {
        @ApiProperty()
        @IsNotEmpty({ message: 'Username cannot be empty' })
        username: string;

        @ApiProperty()
        @IsNotEmpty({ message: 'User email cannot be empty' })
        email: string;
    }

    export class CharacteristicOptionDto {
        @ApiProperty()
        @IsNotEmpty({ message: 'Characteristic cannot be empty' })
        characteristic: string;
    
        @ApiProperty()
        @IsNotEmpty({ message: 'Option selected cannot be empty' })
        option_selected: string;
    }
    
    export class AssociateCharacteristicsDto {
        @ApiProperty({ type: [CharacteristicOptionDto] })
        characteristics: CharacteristicOptionDto[];
    }

    