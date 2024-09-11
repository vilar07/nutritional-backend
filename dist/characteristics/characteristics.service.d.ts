import { CharacteristicsType } from './entities/CharacteristicsType';
import { Repository } from 'typeorm';
import { ProfileCharacteristicsType } from './entities/ProfileCharacteristicsType';
import { CharacteristicsPossibleOptions } from './entities/CharacteristicsPossibleOptions';
import { Characteristics } from './entities/Characteristics';
import { CreateCharacteristicsTypeDto, CreateProfileCharacteristicsTypeDto, CreateCharacteristicsDto, GetCharacteristicsByNameDto, GetOptionsByCharacteristicsNameDto, CreateCharacteristicsPossibleOptionsByNameDto, UpdatePossibleOptionsDto, DeleteCharacteristicsTypeDto, GetOptionsIdDto, CharacteristicsPossibleOptionsDto, CharacteristicsTypeDto, UpdateCharacteristicsTypeDto, UpdateCharacteristicsDto } from './dtos/characteristics.dto';
import { ObjectCharacteristicsAssociation } from 'src/objects/entities/ObjectCharacteristicsAssociation';
export declare class CharacteristicsService {
    private readonly characteristicsTypeRepository;
    private readonly profileCharacteristicsTypeRepository;
    private readonly characteristicsPossibleOptionsRepository;
    private readonly characteristicsRepository;
    private readonly objectCharacteristicsAssociationRepository;
    private readonly logger;
    constructor(characteristicsTypeRepository: Repository<CharacteristicsType>, profileCharacteristicsTypeRepository: Repository<ProfileCharacteristicsType>, characteristicsPossibleOptionsRepository: Repository<CharacteristicsPossibleOptions>, characteristicsRepository: Repository<Characteristics>, objectCharacteristicsAssociationRepository: Repository<ObjectCharacteristicsAssociation>);
    createCharacteristicsType(createCharacteristicsTypeDTO: CreateCharacteristicsTypeDto): Promise<CharacteristicsType>;
    updateCharacteristicsType(dto: CharacteristicsTypeDto, updateCharacteristicsTypeDto: UpdateCharacteristicsTypeDto): Promise<any>;
    deleteCharacteristicsType(dto: DeleteCharacteristicsTypeDto): Promise<any>;
    getCharacteristicsTypes(): Promise<CharacteristicsType[]>;
    createProfileCharacteristicsType(createProfileCharacteristicsTypeDto: CreateProfileCharacteristicsTypeDto): Promise<ProfileCharacteristicsType>;
    updateProfileCharacteristicsType(dto: CharacteristicsTypeDto, updateProfileCharacteristicsTypeDto: UpdateCharacteristicsTypeDto): Promise<any>;
    deleteProfileCharacteristicsType(dto: DeleteCharacteristicsTypeDto): Promise<any>;
    getProfileCharacteristicsTypes(): Promise<ProfileCharacteristicsType[]>;
    createCharacteristicsPossibleOptionsNameBased(createOptionsDto: CreateCharacteristicsPossibleOptionsByNameDto): Promise<CharacteristicsPossibleOptions>;
    deletePossibleOptions(dto: CharacteristicsPossibleOptionsDto): Promise<any>;
    updatePossibleOptions(dto: CharacteristicsPossibleOptionsDto, updateOptionsDto: UpdatePossibleOptionsDto): Promise<any>;
    getAllPossibleOptions(): Promise<CharacteristicsPossibleOptions[]>;
    getOptionsByCharacteristicsName(params: GetOptionsByCharacteristicsNameDto): Promise<CharacteristicsPossibleOptions[]>;
    getOptionsId(params: GetOptionsIdDto): Promise<CharacteristicsPossibleOptions | null>;
    createCharacteristics(createCharacteristicsDto: CreateCharacteristicsDto): Promise<Characteristics>;
    getAllCharacteristics(): Promise<Characteristics[]>;
    getCharacteristicsByName(params: GetCharacteristicsByNameDto): Promise<Characteristics>;
    updateCharacteristics(dto: GetCharacteristicsByNameDto, updateCharacteristicsDto: UpdateCharacteristicsDto): Promise<any>;
    deleteCharacteristics(params: GetCharacteristicsByNameDto): Promise<any>;
}
