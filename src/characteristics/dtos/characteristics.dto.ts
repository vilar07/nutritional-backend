// characteristics.dto.ts

  export class CreateCharacteristicsTypeDto {
    variable_type: string;
  }

  
  export class CreateProfileCharacteristicsTypeDto {
    profile_characteristic_type: string;
  }
  
  export class CreateCharacteristicsPossibleOptionsDto {
    profileCharacteristicsTypeId: number;
    characteristicsTypeId: number;
    possibleOptions: string;
  }

  export class CreateCharacteristicsPossibleOptionsByNameDto {
    profileCharacteristicsTypeName: string;
    characteristicsTypeName: string;
    possibleOptions: string;
  }
  
  export class CreateCharacteristicsDto {
    name: string;
    category: string | null;
    characteristicsPossibleOptionsId: number;
  }

  export class GetOptionsByCharacteristicsDto {
    characteristicsTypeId: number;
    profileCharacteristicsTypeId: number;
  }

  export class GetOptionsByCharacteristicsNameDto {
    characteristicsTypeName: string;
    profileCharacteristicsTypeName: string;
  }

  export class GetCharacteristicsByNameDto {
    name: string;
  }

  