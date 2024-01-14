// characteristics.dto.ts
import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsInt, IsString, IsNotEmpty } from 'class-validator';

  export class CreateCharacteristicsTypeDto {
    @ApiProperty()
    @IsNotEmpty({ message: 'Characteristic type cannot be empty' })
    variable_type: string;
  }

  
  export class CreateProfileCharacteristicsTypeDto {
    @ApiProperty()
    @IsNotEmpty({ message: 'Profile Characteristic type cannot be empty' })
    profile_characteristic_type: string;
  }
  
  export class CreateCharacteristicsPossibleOptionsDto {
    @ApiProperty()
    profileCharacteristicsTypeId: number;
    @ApiProperty()
    characteristicsTypeId: number;
    @ApiProperty()
    possibleOptions: string;
  }

  export class CreateCharacteristicsPossibleOptionsByNameDto {
    @ApiProperty()
    profileCharacteristicsTypeName: string;
    @ApiProperty()
    characteristicsTypeName: string;
    @ApiProperty()
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

  export class GetOptionsByCharacteristicsDto {
    @ApiProperty()
    characteristicsTypeId: number;
    @ApiProperty()
    profileCharacteristicsTypeId: number;
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

  export class UpdateCharacteristicsDto {
    @ApiProperty()
    @IsString({ message: 'Invalid characteristics type name' })
    characteristicsTypeName: string;

    @ApiProperty()
    @IsString({ message: 'Invalid profile characteristics type name' })
    profileCharacteristicsTypeName: string;

    @ApiProperty()
    characteristicsPossibleOptionsId: number;
  }

  