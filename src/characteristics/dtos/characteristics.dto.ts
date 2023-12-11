// characteristics.dto.ts
import { ApiProperty } from '@nestjs/swagger';

  export class CreateCharacteristicsTypeDto {
    @ApiProperty()
    variable_type: string;
  }

  
  export class CreateProfileCharacteristicsTypeDto {
    @ApiProperty()
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

  