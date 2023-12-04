import { Injectable, Logger, NotFoundException, HttpException, HttpStatus, InternalServerErrorException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CharacteristicsType } from './entities/CharacteristicsType';
import { Repository } from 'typeorm';
import { ProfileCharacteristicsType } from './entities/ProfileCharacteristicsType';
import { CharacteristicsPossibleOptions } from './entities/CharacteristicsPossibleOptions';
import { Characteristics } from './entities/Characteristics';
import {CreateCharacteristicsTypeDto,CreateProfileCharacteristicsTypeDto,CreateCharacteristicsPossibleOptionsDto,CreateCharacteristicsDto,GetOptionsByCharacteristicsDto, GetCharacteristicsByNameDto
, GetOptionsByCharacteristicsNameDto, CreateCharacteristicsPossibleOptionsByNameDto} from './dtos/characteristics.dto';


@Injectable()
export class CharacteristicsService {
    private readonly logger = new Logger(CharacteristicsService.name);
    constructor(
        @InjectRepository(CharacteristicsType)
        private readonly characteristicsTypeRepository: Repository<CharacteristicsType>,
        @InjectRepository(ProfileCharacteristicsType)
        private readonly profileCharacteristicsTypeRepository: Repository<ProfileCharacteristicsType>,
        @InjectRepository(CharacteristicsPossibleOptions)
        private readonly characteristicsPossibleOptionsRepository: Repository<CharacteristicsPossibleOptions>,
        @InjectRepository(Characteristics)
        private readonly characteristicsRepository: Repository<Characteristics>,
    ) {}

    // Create characteristics type
    async createCharacteristicsType(createCharacteristicsTypeDTO: CreateCharacteristicsTypeDto): Promise<CharacteristicsType> {
        const existingCharacteristicsType = await this.characteristicsTypeRepository.findOne({
            where: {
                variable_type: createCharacteristicsTypeDTO.variable_type,
            },
        });

        if (existingCharacteristicsType) {
            // If a CharacteristicsType with the same variable type exists, return a message with a 409 status code (Conflict)
            const errorMessage = 'CharacteristicsType with the same characteristic type name already exists';
            throw new HttpException(errorMessage, HttpStatus.CONFLICT);
        }
        const characteristicsType = this.characteristicsTypeRepository.create(createCharacteristicsTypeDTO);
        return await this.characteristicsTypeRepository.save(characteristicsType);
    }

    // Get all characteristics types
    async getCharacteristicsTypes(): Promise<CharacteristicsType[]> {
        return await this.characteristicsTypeRepository.find();
    }

    // Create profile characteristics type
    async createProfileCharacteristicsType(createProfileCharacteristicsTypeDto: CreateProfileCharacteristicsTypeDto): Promise<ProfileCharacteristicsType> {
        
        const existingProfileCharacteristicsType = await this.profileCharacteristicsTypeRepository.findOne({
            where: {
                profile_characteristic_type: createProfileCharacteristicsTypeDto.profile_characteristic_type,
            },
        });
        if(existingProfileCharacteristicsType) {
            // If a ProfileCharacteristicsType with the same profile characteristic type exists, return a message with a 409 status code (Conflict)
            const errorMessage = 'ProfileCharacteristicsType with the same profile characteristic type name already exists';
            throw new HttpException(errorMessage, HttpStatus.CONFLICT);
        }
        
        const profileCharacteristicsType = this.profileCharacteristicsTypeRepository.create(createProfileCharacteristicsTypeDto);
        return await this.profileCharacteristicsTypeRepository.save(profileCharacteristicsType);
    }

    // Get all profile characteristics types
    async getProfileCharacteristicsTypes(): Promise<ProfileCharacteristicsType[]> {
        return await this.profileCharacteristicsTypeRepository.find();
    }
    
    // Create possible options and associate them with a characteristicsType and a profileCharacteristicsType
    async createCharacteristicsPossibleOptions(createOptionsDto: CreateCharacteristicsPossibleOptionsDto): Promise<CharacteristicsPossibleOptions> {
        try {

            const existingOptions = await this.characteristicsPossibleOptionsRepository.findOne({
                where: {
                    profileCharacteristicsType: {
                        id: createOptionsDto.profileCharacteristicsTypeId,
                    },
                    characteristicsType: {
                        id: createOptionsDto.characteristicsTypeId,
                    },
                    possibleOptions: createOptionsDto.possibleOptions,
                },
            });
    
            if (existingOptions) {
                const errorMessage = 'Possible Options for that both Characteristic Type and Profile, already exists.';
                throw new HttpException(errorMessage, HttpStatus.CONFLICT);
            }

            const characteristicsType = await this.characteristicsTypeRepository.findOne({
                where: {
                    id: createOptionsDto.characteristicsTypeId,
                },
            });
            const profileCharacteristicsType = await this.profileCharacteristicsTypeRepository.findOne({
                where: {
                    id: createOptionsDto.profileCharacteristicsTypeId,
                },
            });
            // Check if both entities are found
            if (!characteristicsType || !profileCharacteristicsType) {
                throw new NotFoundException('ProfileCharacteristicsType or CharacteristicsType not found');
            }
            const characteristicsPossibleOptions = this.characteristicsPossibleOptionsRepository.create({
                profileCharacteristicsType: [profileCharacteristicsType], // Note the array syntax
                characteristicsType: [characteristicsType], // Note the array syntax
                possibleOptions: createOptionsDto.possibleOptions,
            });

            // Save the new entity
            console.log(characteristicsPossibleOptions)
            const savedOptions = await this.characteristicsPossibleOptionsRepository.save(characteristicsPossibleOptions);
            // const result = 'Request processed successfully';
            return characteristicsPossibleOptions;
            
        }
        catch (error) {
            if (error instanceof NotFoundException) {
                // Handle not found errors, you may want to return a 404 response or handle it differently
                throw new NotFoundException('ProfileCharacteristicsType or CharacteristicsType not found');
            } else {
                // Handle other types of errors (e.g., conflict)
                throw error;
            }
        }
    }

   
    // Get all possible options
    async getAllPossibleOptions(): Promise<CharacteristicsPossibleOptions[]> {
        try {
            const options = await this.characteristicsPossibleOptionsRepository.find({
                relations: [
                    'profileCharacteristicsType',
                    'characteristicsType'
                ],
            });
    
            if (!options || options.length === 0) {
                throw new NotFoundException('No options found');
            }
    
            return options;
        } catch (error) {
            this.logger.error('Error retrieving options', error);
            throw new NotFoundException('Failed to retrieve options', error);
        }
    }

    // Get Options based on characteristicTypeID and  profileCharacteristicTypeID
    async getOptionsByCharacteristics(params: GetOptionsByCharacteristicsDto): Promise<CharacteristicsPossibleOptions[]> {
        try {
            const options = await this.characteristicsPossibleOptionsRepository.find({
                where: {
                    characteristicsType: { id: params.characteristicsTypeId },
                    profileCharacteristicsType: { id: params.profileCharacteristicsTypeId },
                },
                relations: [
                    'profileCharacteristicsType',
                    'characteristicsType'
                ],
            });
    
            if (!options || options.length === 0) {
                throw new NotFoundException('No options found for the given IDs');
            }
    
            return options;
        } catch (error) {
            this.logger.error('Error retrieving options', error);
            throw new NotFoundException('Failed to retrieve options', error);
        }
    }

    // Get Options based on characteristicTypeName and  profileCharacteristicTypeName
    async getOptionsByCharacteristicsName(params: GetOptionsByCharacteristicsNameDto): Promise<CharacteristicsPossibleOptions[]> {
        try {
            const options = await this.characteristicsPossibleOptionsRepository.find({
                where: {
                    characteristicsType: { variable_type: params.characteristicsTypeName },
                    profileCharacteristicsType: { profile_characteristic_type: params.profileCharacteristicsTypeName },
                },
                // relations: [
                //     'profileCharacteristicsType',
                //     'characteristicsType'
                // ],
            });
    
            if (!options || options.length === 0) {
                throw new NotFoundException('No options found for the given Names');
            }
    
            return options;
        } catch (error) {
            this.logger.error('Error retrieving options', error);
            throw new NotFoundException('Failed to retrieve options', error);
        }
    }

    // Create characteristics
    async createCharacteristics(createCharacteristicsDto: CreateCharacteristicsDto): Promise<Characteristics> {
        try {
            const existingCharacteristic = await this.characteristicsRepository.findOne({
                where: {
                    name: createCharacteristicsDto.name,
                },
            });
    
            if (existingCharacteristic) {
                const errorMessage = 'Characteristic with same name already exists';
                throw new HttpException(errorMessage, HttpStatus.CONFLICT);
            }

            const characteristicsPossibleOptions = await this.characteristicsPossibleOptionsRepository.findOne({
                where: {
                    id: createCharacteristicsDto.characteristicsPossibleOptionsId,
                },
            });
            // Check if both entities are found
            if (!characteristicsPossibleOptions) {
                throw new NotFoundException('CharacteristicsPossibleOptions not found');
            }
            const characteristics = this.characteristicsRepository.create({
                name: createCharacteristicsDto.name,
                category: createCharacteristicsDto.category,
                characteristicsPossibleOptions: characteristicsPossibleOptions,
            });

            // Save the new entity
            const savedCharacteristics = await this.characteristicsRepository.save(characteristics);
            // const result = 'Request processed successfully';
            return characteristics;
            
        }
        catch (error) {
            if (error instanceof NotFoundException) {
                // Handle not found errors, you may want to return a 404 response or handle it differently
                throw new NotFoundException('Error creating characteristics');
            } else {
                // Handle other types of errors (e.g., conflict)
                throw error;
            }
        }
    }

    // Get all characteristics
    async getAllCharacteristics(): Promise<Characteristics[]> {
        try {
            const characteristicsList = await this.characteristicsRepository.find({
                relations: [
                    'characteristicsPossibleOptions'
                ],
            });

            if (!characteristicsList || characteristicsList.length === 0) {
                throw new NotFoundException('No characteristics found');
            }

            return characteristicsList;
        } catch (error) {
            // Handle errors, you may want to return a different status code or handle it differently
            throw new NotFoundException('Failed to retrieve characteristics', error);
        }
    }

    // Get Characteristics by name
    async getCharacteristicsByName(params: GetCharacteristicsByNameDto): Promise<Characteristics> {
        try {
            const characteristic = await this.characteristicsRepository.findOne({
                where: {
                    name: params.name ,
                },
                relations: [
                    'characteristicsPossibleOptions',
                    'characteristicsPossibleOptions.profileCharacteristicsType',
                    'characteristicsPossibleOptions.characteristicsType'
                ],
            });
    
            if (!characteristic) {
                throw new NotFoundException('No characteristic found for the given name');
            }
    
            return characteristic;
        } catch (error) {
            this.logger.error('Error retrieving characteristic', error);
            throw new NotFoundException('Failed to retrieve characteristic', error);
        }
    }

}
