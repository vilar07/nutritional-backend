import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { NotFoundException } from '@nestjs/common';
import { CharacteristicsType } from './entities/CharacteristicsType';
import { Repository } from 'typeorm';
import { ProfileCharacteristicsType } from './entities/ProfileCharacteristicsType';
import { CharacteristicsPossibleOptions } from './entities/CharacteristicsPossibleOptions';
import { Characteristics } from './entities/Characteristics';
import {
    CreateCharacteristicsTypeDto,
    CreateProfileCharacteristicsTypeDto,
    CreateCharacteristicsPossibleOptionsDto,
    CreateCharacteristicsDto,
  } from './dtos/characteristics.dto';

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
        const characteristicsType = this.characteristicsTypeRepository.create(createCharacteristicsTypeDTO);
        return await this.characteristicsTypeRepository.save(characteristicsType);
    }

    // Get all characteristics types
    async getCharacteristicsTypes(): Promise<CharacteristicsType[]> {
        return await this.characteristicsTypeRepository.find();
    }

    // Create profile characteristics type
    async createProfileCharacteristicsType(createProfileCharacteristicsTypeDto: CreateProfileCharacteristicsTypeDto): Promise<ProfileCharacteristicsType> {
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
            // Handle not found errors, you may want to return a 404 response or handle it differently
            throw new NotFoundException('ProfileCharacteristicsType or CharacteristicsType not found');
          }
    }

    // Get all possible options
    async getAllPossibleOptions(): Promise<CharacteristicsPossibleOptions[]> {
        try {
            const options = await this.characteristicsPossibleOptionsRepository.find();
    
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
    async getOptionsByCharacteristics(
        characteristicsTypeId: number,
        profileCharacteristicsTypeId: number,
    ): Promise<CharacteristicsPossibleOptions[]> {
        try {
            const options = await this.characteristicsPossibleOptionsRepository.find({
                where: {
                    characteristicsType: { id: characteristicsTypeId },
                    profileCharacteristicsType: { id: profileCharacteristicsTypeId },
                },
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

}
