import { CharacteristicsService } from './characteristics.service';
import { CreateCharacteristicsTypeDto, CreateProfileCharacteristicsTypeDto, GetOptionsIdDto, CharacteristicsPossibleOptionsDto, CreateCharacteristicsDto, GetCharacteristicsByNameDto, GetOptionsByCharacteristicsNameDto, CreateCharacteristicsPossibleOptionsByNameDto, UpdateCharacteristicsTypeDto, DeleteCharacteristicsTypeDto, UpdatePossibleOptionsDto, CharacteristicsTypeDto, UpdateCharacteristicsDto } from './dtos/characteristics.dto';
export declare class CharacteristicsController {
    private readonly characteristicsService;
    private readonly logger;
    constructor(characteristicsService: CharacteristicsService);
    getCharacteristicsTypes(): Promise<import("./entities/CharacteristicsType").CharacteristicsType[]>;
    createCharacteristicsType(createCharacteristicsTypeDto: CreateCharacteristicsTypeDto): Promise<import("./entities/CharacteristicsType").CharacteristicsType>;
    updateCharacteristicsType(params: CharacteristicsTypeDto, dto: UpdateCharacteristicsTypeDto): Promise<any>;
    deleteCharacteristicsType(params: DeleteCharacteristicsTypeDto): Promise<any>;
    getProfileCharacteristicsTypes(): Promise<import("./entities/ProfileCharacteristicsType").ProfileCharacteristicsType[]>;
    createProfileCharacteristicsType(createProfileCharacteristicsTypeDto: CreateProfileCharacteristicsTypeDto): Promise<import("./entities/ProfileCharacteristicsType").ProfileCharacteristicsType>;
    updateProfileCharacteristicsType(params: CharacteristicsTypeDto, dto: UpdateCharacteristicsTypeDto): Promise<any>;
    deleteProfileCharacteristicsType(params: DeleteCharacteristicsTypeDto): Promise<any>;
    getAllPossibleOptions(): Promise<import("./entities/CharacteristicsPossibleOptions").CharacteristicsPossibleOptions[]>;
    getOptionsByCharacteristicsName(params: GetOptionsByCharacteristicsNameDto): Promise<import("./entities/CharacteristicsPossibleOptions").CharacteristicsPossibleOptions[]>;
    getOptionsByIds(params: GetOptionsIdDto): Promise<import("./entities/CharacteristicsPossibleOptions").CharacteristicsPossibleOptions>;
    createPossibleOptionsNameBased(createOptionsDto: CreateCharacteristicsPossibleOptionsByNameDto): Promise<import("./entities/CharacteristicsPossibleOptions").CharacteristicsPossibleOptions>;
    updatePossibleOptions(params: CharacteristicsPossibleOptionsDto, updateOptionsDto: UpdatePossibleOptionsDto): Promise<any>;
    deletePossibleOptions(params: CharacteristicsPossibleOptionsDto): Promise<any>;
    getAllCharacteristics(): Promise<import("./entities/Characteristics").Characteristics[]>;
    getCharacteristicsByName(params: GetCharacteristicsByNameDto): Promise<import("./entities/Characteristics").Characteristics>;
    createCharacteristics(createCharacteristicsDto: CreateCharacteristicsDto): Promise<import("./entities/Characteristics").Characteristics>;
    updateCharacteristics(params: GetCharacteristicsByNameDto, dto: UpdateCharacteristicsDto): Promise<any>;
    deleteCharacteristics(params: GetCharacteristicsByNameDto): Promise<any>;
}
