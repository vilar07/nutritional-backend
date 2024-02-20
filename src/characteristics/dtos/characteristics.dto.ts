// characteristics.dto.ts
import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsInt, IsString, IsNotEmpty } from 'class-validator';

  export class CreateCharacteristicsTypeDto {
    @ApiProperty()
    @IsNotEmpty({ message: 'Characteristic type cannot be empty' })
    variable_type: string;
  }

  export class CharacteristicsTypeDto {
    @ApiProperty()
    @IsNotEmpty({ message: 'Characteristic type cannot be empty' })
    variable_type: string;
  }

  export class UpdateCharacteristicsTypeDto {
    @ApiProperty()
    @IsNotEmpty({ message: 'Updated Characteristic type cannot be empty' })
    updatedTypeName: string;
  }

  
  export class CreateProfileCharacteristicsTypeDto {
    @ApiProperty()
    @IsNotEmpty({ message: 'Profile Characteristic type cannot be empty' })
    profile_characteristic_type: string;
  }

  export class CreateCharacteristicsPossibleOptionsByNameDto {
    @ApiProperty()
    @IsNotEmpty({ message: 'Characteristic profile type cannot be empty' })
    profileCharacteristicsTypeName: string;
    @ApiProperty()
    @IsNotEmpty({ message: 'Characteristic type cannot be empty' })
    characteristicsTypeName: string;
    @ApiProperty()
    @IsNotEmpty({ message: 'Possible Options cannot be empty' })
    possibleOptions: string;
  }

  export class DeleteCharacteristicsPossibleOptionsDto {
    @ApiProperty()
    @IsNotEmpty({ message: 'Characteristic profile type cannot be empty' })
    profileCharacteristicsTypeName: string;
    @ApiProperty()
    @IsNotEmpty({ message: 'Characteristic type cannot be empty' })
    characteristicsTypeName: string;
    @ApiProperty()
    @IsNotEmpty({ message: 'Possible Options cannot be empty' })
    possibleOptions: string;
  }
  
  export class CreateCharacteristicsDto {
    @ApiProperty()
    name: string;
    @ApiProperty()
    category: string | null;
    @ApiProperty()
    characteristicsPossibleOptionsId: number;
  }

  export class UpdateCharacteristicsDto {
    @ApiProperty()
    name: string | null;
    @ApiProperty()
    category: string | null;
    @ApiProperty()
    characteristicsPossibleOptionsId: number | null;
  }

  export class CharacteristicsPossibleOptionsDto {
    @ApiProperty()
    characteristicsTypeName: string;
    @ApiProperty()
    profileCharacteristicsTypeName: string;
    @ApiProperty()
    possibleOptions: string;
  }

  export class UpdatePossibleOptionsDto {
    @ApiProperty()
    updatedPossibleOptions: string;
  }

  export class GetOptionsByCharacteristicsNameDto {
    @ApiProperty()
    characteristicsTypeName: string;
    @ApiProperty()
    profileCharacteristicsTypeName: string;
  }

  export class GetOptionsIdDto {
    @ApiProperty()
    characteristicsTypeName: string;
    @ApiProperty()
    profileCharacteristicsTypeName: string;
    @ApiProperty()
    possibleOptions: string;
  }


  export class GetCharacteristicsByNameDto {
    @ApiProperty()
    name: string;
  }

  export class DeleteCharacteristicsTypeDto {
    @IsString()
    @ApiProperty()
    typeName: string;
  }
  