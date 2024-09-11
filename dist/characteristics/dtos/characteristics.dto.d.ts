export declare class CreateCharacteristicsTypeDto {
    variable_type: string;
}
export declare class CharacteristicsTypeDto {
    variable_type: string;
}
export declare class UpdateCharacteristicsTypeDto {
    updatedTypeName: string;
}
export declare class CreateProfileCharacteristicsTypeDto {
    profile_characteristic_type: string;
}
export declare class CreateCharacteristicsPossibleOptionsByNameDto {
    profileCharacteristicsTypeName: string;
    characteristicsTypeName: string;
    possibleOptions: string;
}
export declare class DeleteCharacteristicsPossibleOptionsDto {
    profileCharacteristicsTypeName: string;
    characteristicsTypeName: string;
    possibleOptions: string;
}
export declare class CreateCharacteristicsDto {
    name: string;
    category: string | null;
    characteristicsPossibleOptionsId: number;
}
export declare class UpdateCharacteristicsDto {
    name: string | null;
    category: string | null;
    characteristicsPossibleOptionsId: number | null;
}
export declare class CharacteristicsPossibleOptionsDto {
    characteristicsTypeName: string;
    profileCharacteristicsTypeName: string;
    possibleOptions: string;
}
export declare class UpdatePossibleOptionsDto {
    updatedPossibleOptions: string;
}
export declare class GetOptionsByCharacteristicsNameDto {
    characteristicsTypeName: string;
    profileCharacteristicsTypeName: string;
}
export declare class GetOptionsIdDto {
    characteristicsTypeName: string;
    profileCharacteristicsTypeName: string;
    possibleOptions: string;
}
export declare class GetCharacteristicsByNameDto {
    name: string;
}
export declare class DeleteCharacteristicsTypeDto {
    typeName: string;
}
