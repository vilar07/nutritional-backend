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
  
  export class CreateCharacteristicsDto {
    name: string;
    category: string | null;
    created_at: Date;
    characteristicsPossibleOptionsId: number;
  }

  export class GetOptionsByCharacteristicsDto {
    characteristicsTypeId: number;
    profileCharacteristicsTypeId: number;
  }
  