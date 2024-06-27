import { Injectable, Logger, NotFoundException, HttpException, HttpStatus, InternalServerErrorException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CharacteristicsType } from './entities/CharacteristicsType';
import { Repository, In } from 'typeorm';
import { ProfileCharacteristicsType } from './entities/ProfileCharacteristicsType';
import { CharacteristicsPossibleOptions } from './entities/CharacteristicsPossibleOptions';
import { Characteristics } from './entities/Characteristics';
import {CreateCharacteristicsTypeDto,CreateProfileCharacteristicsTypeDto,CreateCharacteristicsDto, GetCharacteristicsByNameDto
, GetOptionsByCharacteristicsNameDto, CreateCharacteristicsPossibleOptionsByNameDto, UpdatePossibleOptionsDto,
DeleteCharacteristicsTypeDto, GetOptionsIdDto, CharacteristicsPossibleOptionsDto, CharacteristicsTypeDto,
UpdateCharacteristicsTypeDto,
UpdateCharacteristicsDto} from './dtos/characteristics.dto';
import { ObjectCharacteristicsAssociation } from 'src/objects/entities/ObjectCharacteristicsAssociation';


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
        @InjectRepository(ObjectCharacteristicsAssociation)
        private readonly objectCharacteristicsAssociationRepository: Repository<ObjectCharacteristicsAssociation>,
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

    // Update characteristics type
    async updateCharacteristicsType(dto: CharacteristicsTypeDto, updateCharacteristicsTypeDto: UpdateCharacteristicsTypeDto): Promise<any> {
        try {
            const characteristicsType = await this.characteristicsTypeRepository.findOne({
                where: {
                    variable_type: dto.variable_type,
                },
            });
    
            if (!characteristicsType) {
                throw new NotFoundException('CharacteristicsType not found');
            }
    
            characteristicsType.variable_type = updateCharacteristicsTypeDto.updatedTypeName;
    
            await this.characteristicsTypeRepository.save(characteristicsType);
    
            return {
                status: HttpStatus.OK,
                message: 'Characteristic Type Updated successfully',
            };
        } catch (error) {
            if (error instanceof NotFoundException) {
                throw new HttpException(error.message, HttpStatus.NOT_FOUND);
            } else {
                throw new HttpException('Internal Server Error', HttpStatus.INTERNAL_SERVER_ERROR);
            }
        }
    }

    // Delete characteristics type and associated relations
    async deleteCharacteristicsType(dto: DeleteCharacteristicsTypeDto): Promise<any> {
        try {
            const characteristicsType = await this.characteristicsTypeRepository.findOne({
                where: {
                    variable_type: dto.typeName,
                },
                relations: ['characteristicsPossibleOptions'],
            });
    
            if (!characteristicsType) {
                throw new NotFoundException('CharacteristicsType not found');
            }
    
            const characteristicsPossibleOptionsIds = characteristicsType.characteristicsPossibleOptions.map(option => option.id);
    
            // Retrieve characteristics associated with the characteristicsPossibleOptionsIds
            const characteristics = await this.characteristicsRepository.find({
                where: {
                    characteristicsPossibleOptions: {
                        id: In(characteristicsPossibleOptionsIds),
                    },
                },
            });

            //delete from object_characteristics_association all the lines with the characteristics associated
            const objectCharacteristicsAssociation = await this.objectCharacteristicsAssociationRepository.find({
                where: {
                    characteristics: {
                        id: In(characteristics.map(c => c.id)),
                    },
                },
            });

            if (objectCharacteristicsAssociation.length > 0) {
                await this.objectCharacteristicsAssociationRepository.remove(objectCharacteristicsAssociation);
            }

            await this.characteristicsRepository.remove(characteristics);
    
            // Delete characteristicsPossibleOptions
            await this.characteristicsPossibleOptionsRepository.remove(characteristicsType.characteristicsPossibleOptions);
    
            // Delete characteristicsType
            await this.characteristicsTypeRepository.remove(characteristicsType);
    
            return 'Characteristics deleted successfully';
        } catch (error) {
            if (error instanceof NotFoundException) {
                throw new HttpException(error.message, HttpStatus.NOT_FOUND);
            } else {
                throw new HttpException('Internal Server Error', HttpStatus.INTERNAL_SERVER_ERROR);
            }
        }
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

    // Update profile characteristics type
    async updateProfileCharacteristicsType(dto: CharacteristicsTypeDto, updateProfileCharacteristicsTypeDto: UpdateCharacteristicsTypeDto): Promise<any> {
        try {
            const profileCharacteristicsType = await this.profileCharacteristicsTypeRepository.findOne({
                where: {
                    profile_characteristic_type: dto.variable_type,
                },
            });
    
            if (!profileCharacteristicsType) {
                throw new NotFoundException('ProfileCharacteristicsType not found');
            }
    
            profileCharacteristicsType.profile_characteristic_type = updateProfileCharacteristicsTypeDto.updatedTypeName;
    
            await this.profileCharacteristicsTypeRepository.save(profileCharacteristicsType);
    
            return {
                status: HttpStatus.OK,
                message: 'Profile Characteristic Type Updated successfully',
            };
        } catch (error) {
            if (error instanceof NotFoundException) {
                throw new HttpException(error.message, HttpStatus.NOT_FOUND);
            } else {
                throw new HttpException('Internal Server Error', HttpStatus.INTERNAL_SERVER_ERROR);
            }
        }
    }

    // Delete characteristics type and associated relations
    async deleteProfileCharacteristicsType(dto: DeleteCharacteristicsTypeDto): Promise<any> {
        try {
            const profileCharacteristicsType = await this.profileCharacteristicsTypeRepository.findOne({
                where: {
                    profile_characteristic_type: dto.typeName,
                },
                relations: ['characteristicsPossibleOptions'],
            });
    
            if (!profileCharacteristicsType) {
                throw new NotFoundException('ProfileCharacteristicsType not found');
            }
    
            const characteristicsPossibleOptionsIds = profileCharacteristicsType.characteristicsPossibleOptions.map(option => option.id);
    
            // Retrieve characteristics associated with the characteristicsPossibleOptionsIds
            const characteristics = await this.characteristicsRepository.find({
                where: {
                    characteristicsPossibleOptions: {
                        id: In(characteristicsPossibleOptionsIds),
                    },
                },
            });

            //delete from object_characteristics_association all the lines with the characteristics associated
            const objectCharacteristicsAssociation = await this.objectCharacteristicsAssociationRepository.find({
                where: {
                    characteristics: {
                        id: In(characteristics.map(c => c.id)),
                    },
                },
            });

            if (objectCharacteristicsAssociation.length > 0) {
                await this.objectCharacteristicsAssociationRepository.remove(objectCharacteristicsAssociation);
            }
    
            await this.characteristicsRepository.remove(characteristics);
    
            // Delete characteristicsPossibleOptions
            await this.characteristicsPossibleOptionsRepository.remove(profileCharacteristicsType.characteristicsPossibleOptions);
    
            // Delete characteristicsType
            await this.profileCharacteristicsTypeRepository.remove(profileCharacteristicsType);
    
            return 'Characteristics deleted successfully';
        } catch (error) {
            if (error instanceof NotFoundException) {
                throw new HttpException(error.message, HttpStatus.NOT_FOUND);
            } else {
                throw new HttpException('Internal Server Error', HttpStatus.INTERNAL_SERVER_ERROR);
            }
        }
    }

    // Get all profile characteristics types
    async getProfileCharacteristicsTypes(): Promise<ProfileCharacteristicsType[]> {
        return await this.profileCharacteristicsTypeRepository.find();
    }
    
    // Create possible options and associate them with a characteristicsType and a profileCharacteristicsType
    async createCharacteristicsPossibleOptionsNameBased(createOptionsDto: CreateCharacteristicsPossibleOptionsByNameDto): Promise<CharacteristicsPossibleOptions> {
        try {
            const existingOptions = await this.characteristicsPossibleOptionsRepository.findOne({
                where: {
                    profileCharacteristicsType: {
                        profile_characteristic_type: createOptionsDto.profileCharacteristicsTypeName,
                    },
                    characteristicsType: {
                        variable_type: createOptionsDto.characteristicsTypeName,
                    },
                    possibleOptions: createOptionsDto.possibleOptions,
                },
            });

            if (existingOptions) {
                const errorMessage = 'Possible Options for that both Characteristic Type and Profile, already exists.';
                throw new HttpException(errorMessage, HttpStatus.CONFLICT);
            }
            console.log(createOptionsDto);
            const characteristicsType = await this.characteristicsTypeRepository.findOne({
                where: {
                    variable_type: createOptionsDto.characteristicsTypeName,
                },
            });
            const profileCharacteristicsType = await this.profileCharacteristicsTypeRepository.findOne({
                where: {
                    profile_characteristic_type: createOptionsDto.profileCharacteristicsTypeName,
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
            console.log(characteristicsPossibleOptions);
            const savedOptions = await this.characteristicsPossibleOptionsRepository.save(characteristicsPossibleOptions);

            return characteristicsPossibleOptions;

        } catch (error) {
            if (error instanceof NotFoundException) {
                throw new NotFoundException('ProfileCharacteristicsType or CharacteristicsType not found');
            } else {
                throw error;
            }
        }
    }

    // Delete possible options
    async deletePossibleOptions(dto: CharacteristicsPossibleOptionsDto): Promise<any> {
        try {
            const characteristicsPossibleOptions = await this.characteristicsPossibleOptionsRepository.findOne({
                where: {
                    profileCharacteristicsType: {
                        profile_characteristic_type: dto.profileCharacteristicsTypeName,
                    },
                    characteristicsType: {
                        variable_type: dto.characteristicsTypeName,
                    },
                    possibleOptions: dto.possibleOptions,
                },
                relations: ['profileCharacteristicsType', 'characteristicsType'],
            });
    
            if (!characteristicsPossibleOptions) {
                console.log('CharacteristicsPossibleOptions not found');
                throw new NotFoundException('CharacteristicsPossibleOptions not found');
            }

            // Delete all characteristics with the given characteristicsPossibleOptions
            const possibleOptionsId = characteristicsPossibleOptions.id;

            await this.characteristicsRepository.delete({
                characteristicsPossibleOptions: { id: possibleOptionsId },
            });

            // Delete the characteristicsPossibleOptions
            await this.characteristicsPossibleOptionsRepository.delete({
                id: possibleOptionsId,
            });
    
            return {
                status: HttpStatus.OK,
                message: 'CharacteristicsPossibleOptions deleted successfully',
            };
        } catch (error) {
            console.error('Error in deletePossibleOptions method:', error);
    
            if (error instanceof NotFoundException) {
                throw new HttpException(error.message, HttpStatus.NOT_FOUND);
            } else {
                throw new HttpException('Internal Server Error', HttpStatus.INTERNAL_SERVER_ERROR);
            }
        }
    }

    // Update possible options
    async updatePossibleOptions(dto: CharacteristicsPossibleOptionsDto, updateOptionsDto: UpdatePossibleOptionsDto): Promise<any> {
        try {
            const characteristicsPossibleOptions = await this.characteristicsPossibleOptionsRepository.findOne({
                where: {
                    profileCharacteristicsType: {
                        profile_characteristic_type: dto.profileCharacteristicsTypeName,
                    },
                    characteristicsType: {
                        variable_type: dto.characteristicsTypeName,
                    },
                    possibleOptions: dto.possibleOptions,
                },
                relations: ['profileCharacteristicsType', 'characteristicsType'],
            });
    
            if (!characteristicsPossibleOptions) {
                throw new NotFoundException('CharacteristicsPossibleOptions not found');
            }
    
            characteristicsPossibleOptions.possibleOptions = updateOptionsDto.updatedPossibleOptions;
    
            await this.characteristicsPossibleOptionsRepository.save(characteristicsPossibleOptions);
    
            return {
                status: HttpStatus.OK,
                message: 'CharacteristicsPossibleOptions updated successfully',
            };
        } catch (error) {
            if (error instanceof NotFoundException) {
                throw new HttpException(error.message, HttpStatus.NOT_FOUND);
            } else {
                throw new HttpException('Internal Server Error', HttpStatus.INTERNAL_SERVER_ERROR);
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

    //Get Options ID based on characteristicTypeName and  profileCharacteristicTypeName and possibleOptions
    async getOptionsId(params: GetOptionsIdDto): Promise<CharacteristicsPossibleOptions | null> {
        try {
            const options = await this.characteristicsPossibleOptionsRepository.findOne({
                where: {
                    characteristicsType: { variable_type: params.characteristicsTypeName },
                    profileCharacteristicsType: { profile_characteristic_type: params.profileCharacteristicsTypeName },
                    possibleOptions: params.possibleOptions,
                },
            });
    
            if (!options) {
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
                    'characteristicsPossibleOptions',
                    'characteristicsPossibleOptions.profileCharacteristicsType',
                    'characteristicsPossibleOptions.characteristicsType'
                ],
                order: {
                    name: 'ASC',
                },
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

    // Update characteristics
    async updateCharacteristics(dto: GetCharacteristicsByNameDto, updateCharacteristicsDto: UpdateCharacteristicsDto): Promise<any> {
        try {
            const characteristics = await this.characteristicsRepository.findOne({
                where: {
                    name: dto.name,
                },
                relations: [
                    'characteristicsPossibleOptions',
                    'characteristicsPossibleOptions.profileCharacteristicsType',
                    'characteristicsPossibleOptions.characteristicsType'
                ],
            });
    
            if (!characteristics) {
                throw new NotFoundException('Characteristics not found');
            }
    
            characteristics.name = updateCharacteristicsDto.name;
            characteristics.category = updateCharacteristicsDto.category;
            characteristics.characteristicsPossibleOptions.id = updateCharacteristicsDto.characteristicsPossibleOptionsId;
    
            await this.characteristicsRepository.save(characteristics);
    
            return {
                status: HttpStatus.OK,
                message: 'Characteristics updated successfully',
            };
        } catch (error) {
            if (error instanceof NotFoundException) {
                throw new HttpException(error.message, HttpStatus.NOT_FOUND);
            } else {
                throw new HttpException('Internal Server Error', HttpStatus.INTERNAL_SERVER_ERROR);
            }
        }
    }

    // Delete characteristics
    async deleteCharacteristics(params: GetCharacteristicsByNameDto): Promise<any> {
        try {
            //delete from object_characteristics_association
            const objectCharacteristicsAssociation = await this.objectCharacteristicsAssociationRepository.find({
                where: {
                    characteristics: {
                        name: params.name,
                    },
                },
            });

            if (objectCharacteristicsAssociation.length > 0) {
                await this.objectCharacteristicsAssociationRepository.remove(objectCharacteristicsAssociation);
            }

            const characteristic = await this.characteristicsRepository.findOne({
                where: {
                    name: params.name,
                },
            });

            console.log(characteristic);
    
            if (!characteristic) {
                throw new NotFoundException('Characteristics not found');
            }
    
            await this.characteristicsRepository.delete(characteristic.id);
    
            return {
                status: HttpStatus.OK,
                message: 'Characteristics deleted successfully',
            };
        } catch (error) {
            if (error instanceof NotFoundException) {
                throw new HttpException(error.message, HttpStatus.NOT_FOUND);
            } else {
                throw new HttpException('Internal Server Error', HttpStatus.INTERNAL_SERVER_ERROR);
            }
        }
    }


}
