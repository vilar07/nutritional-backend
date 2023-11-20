import { Injectable } from '@nestjs/common';
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

    async createCharacteristicsType(createCharacteristicsTypeDTO: CreateCharacteristicsTypeDto): Promise<CharacteristicsType> {
        const characteristicsType = this.characteristicsTypeRepository.create(createCharacteristicsTypeDTO);
        return await this.characteristicsTypeRepository.save(characteristicsType);
    }

    async getCharacteristicsTypes(): Promise<CharacteristicsType[]> {
        return await this.characteristicsTypeRepository.find();
    }

    async createProfileCharacteristicsType(createProfileCharacteristicsTypeDto: CreateProfileCharacteristicsTypeDto): Promise<ProfileCharacteristicsType> {
        const profileCharacteristicsType = this.profileCharacteristicsTypeRepository.create(createProfileCharacteristicsTypeDto);
        return await this.profileCharacteristicsTypeRepository.save(profileCharacteristicsType);
    }

    async getProfileCharacteristicsTypes(): Promise<ProfileCharacteristicsType[]> {
        return await this.profileCharacteristicsTypeRepository.find();
    }
    
    async createCharacteristicsPossibleOptions(createOptionsDto: CreateCharacteristicsPossibleOptionsDto): Promise<CharacteristicsPossibleOptions> {
        try {
            const profileCharacteristicsTypeId = await this.characteristicsTypeRepository.findOne(createOptionsDto.profileCharacteristicsTypeId);
        }
        catch (error) {
            // Handle not found errors, you may want to return a 404 response or handle it differently
            throw new NotFoundException('ProfileCharacteristicsType or CharacteristicsType not found');
          }
    }

}
