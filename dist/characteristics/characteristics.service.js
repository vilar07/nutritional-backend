"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var CharacteristicsService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.CharacteristicsService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const CharacteristicsType_1 = require("./entities/CharacteristicsType");
const typeorm_2 = require("typeorm");
const ProfileCharacteristicsType_1 = require("./entities/ProfileCharacteristicsType");
const CharacteristicsPossibleOptions_1 = require("./entities/CharacteristicsPossibleOptions");
const Characteristics_1 = require("./entities/Characteristics");
const ObjectCharacteristicsAssociation_1 = require("../objects/entities/ObjectCharacteristicsAssociation");
let CharacteristicsService = CharacteristicsService_1 = class CharacteristicsService {
    constructor(characteristicsTypeRepository, profileCharacteristicsTypeRepository, characteristicsPossibleOptionsRepository, characteristicsRepository, objectCharacteristicsAssociationRepository) {
        this.characteristicsTypeRepository = characteristicsTypeRepository;
        this.profileCharacteristicsTypeRepository = profileCharacteristicsTypeRepository;
        this.characteristicsPossibleOptionsRepository = characteristicsPossibleOptionsRepository;
        this.characteristicsRepository = characteristicsRepository;
        this.objectCharacteristicsAssociationRepository = objectCharacteristicsAssociationRepository;
        this.logger = new common_1.Logger(CharacteristicsService_1.name);
    }
    async createCharacteristicsType(createCharacteristicsTypeDTO) {
        const existingCharacteristicsType = await this.characteristicsTypeRepository.findOne({
            where: {
                variable_type: createCharacteristicsTypeDTO.variable_type,
            },
        });
        if (existingCharacteristicsType) {
            const errorMessage = 'CharacteristicsType with the same characteristic type name already exists';
            throw new common_1.HttpException(errorMessage, common_1.HttpStatus.CONFLICT);
        }
        const characteristicsType = this.characteristicsTypeRepository.create(createCharacteristicsTypeDTO);
        return await this.characteristicsTypeRepository.save(characteristicsType);
    }
    async updateCharacteristicsType(dto, updateCharacteristicsTypeDto) {
        try {
            const characteristicsType = await this.characteristicsTypeRepository.findOne({
                where: {
                    variable_type: dto.variable_type,
                },
            });
            if (!characteristicsType) {
                throw new common_1.NotFoundException('CharacteristicsType not found');
            }
            characteristicsType.variable_type = updateCharacteristicsTypeDto.updatedTypeName;
            await this.characteristicsTypeRepository.save(characteristicsType);
            return {
                status: common_1.HttpStatus.OK,
                message: 'Characteristic Type Updated successfully',
            };
        }
        catch (error) {
            if (error instanceof common_1.NotFoundException) {
                throw new common_1.HttpException(error.message, common_1.HttpStatus.NOT_FOUND);
            }
            else {
                throw new common_1.HttpException('Internal Server Error', common_1.HttpStatus.INTERNAL_SERVER_ERROR);
            }
        }
    }
    async deleteCharacteristicsType(dto) {
        try {
            const characteristicsType = await this.characteristicsTypeRepository.findOne({
                where: {
                    variable_type: dto.typeName,
                },
                relations: ['characteristicsPossibleOptions'],
            });
            if (!characteristicsType) {
                throw new common_1.NotFoundException('CharacteristicsType not found');
            }
            const characteristicsPossibleOptionsIds = characteristicsType.characteristicsPossibleOptions.map(option => option.id);
            const characteristics = await this.characteristicsRepository.find({
                where: {
                    characteristicsPossibleOptions: {
                        id: (0, typeorm_2.In)(characteristicsPossibleOptionsIds),
                    },
                },
            });
            const objectCharacteristicsAssociation = await this.objectCharacteristicsAssociationRepository.find({
                where: {
                    characteristics: {
                        id: (0, typeorm_2.In)(characteristics.map(c => c.id)),
                    },
                },
            });
            if (objectCharacteristicsAssociation.length > 0) {
                await this.objectCharacteristicsAssociationRepository.remove(objectCharacteristicsAssociation);
            }
            await this.characteristicsRepository.remove(characteristics);
            await this.characteristicsPossibleOptionsRepository.remove(characteristicsType.characteristicsPossibleOptions);
            await this.characteristicsTypeRepository.remove(characteristicsType);
            return 'Characteristics deleted successfully';
        }
        catch (error) {
            if (error instanceof common_1.NotFoundException) {
                throw new common_1.HttpException(error.message, common_1.HttpStatus.NOT_FOUND);
            }
            else {
                throw new common_1.HttpException('Internal Server Error', common_1.HttpStatus.INTERNAL_SERVER_ERROR);
            }
        }
    }
    async getCharacteristicsTypes() {
        return await this.characteristicsTypeRepository.find();
    }
    async createProfileCharacteristicsType(createProfileCharacteristicsTypeDto) {
        const existingProfileCharacteristicsType = await this.profileCharacteristicsTypeRepository.findOne({
            where: {
                profile_characteristic_type: createProfileCharacteristicsTypeDto.profile_characteristic_type,
            },
        });
        if (existingProfileCharacteristicsType) {
            const errorMessage = 'ProfileCharacteristicsType with the same profile characteristic type name already exists';
            throw new common_1.HttpException(errorMessage, common_1.HttpStatus.CONFLICT);
        }
        const profileCharacteristicsType = this.profileCharacteristicsTypeRepository.create(createProfileCharacteristicsTypeDto);
        return await this.profileCharacteristicsTypeRepository.save(profileCharacteristicsType);
    }
    async updateProfileCharacteristicsType(dto, updateProfileCharacteristicsTypeDto) {
        try {
            const profileCharacteristicsType = await this.profileCharacteristicsTypeRepository.findOne({
                where: {
                    profile_characteristic_type: dto.variable_type,
                },
            });
            if (!profileCharacteristicsType) {
                throw new common_1.NotFoundException('ProfileCharacteristicsType not found');
            }
            profileCharacteristicsType.profile_characteristic_type = updateProfileCharacteristicsTypeDto.updatedTypeName;
            await this.profileCharacteristicsTypeRepository.save(profileCharacteristicsType);
            return {
                status: common_1.HttpStatus.OK,
                message: 'Profile Characteristic Type Updated successfully',
            };
        }
        catch (error) {
            if (error instanceof common_1.NotFoundException) {
                throw new common_1.HttpException(error.message, common_1.HttpStatus.NOT_FOUND);
            }
            else {
                throw new common_1.HttpException('Internal Server Error', common_1.HttpStatus.INTERNAL_SERVER_ERROR);
            }
        }
    }
    async deleteProfileCharacteristicsType(dto) {
        try {
            const profileCharacteristicsType = await this.profileCharacteristicsTypeRepository.findOne({
                where: {
                    profile_characteristic_type: dto.typeName,
                },
                relations: ['characteristicsPossibleOptions'],
            });
            if (!profileCharacteristicsType) {
                throw new common_1.NotFoundException('ProfileCharacteristicsType not found');
            }
            const characteristicsPossibleOptionsIds = profileCharacteristicsType.characteristicsPossibleOptions.map(option => option.id);
            const characteristics = await this.characteristicsRepository.find({
                where: {
                    characteristicsPossibleOptions: {
                        id: (0, typeorm_2.In)(characteristicsPossibleOptionsIds),
                    },
                },
            });
            const objectCharacteristicsAssociation = await this.objectCharacteristicsAssociationRepository.find({
                where: {
                    characteristics: {
                        id: (0, typeorm_2.In)(characteristics.map(c => c.id)),
                    },
                },
            });
            if (objectCharacteristicsAssociation.length > 0) {
                await this.objectCharacteristicsAssociationRepository.remove(objectCharacteristicsAssociation);
            }
            await this.characteristicsRepository.remove(characteristics);
            await this.characteristicsPossibleOptionsRepository.remove(profileCharacteristicsType.characteristicsPossibleOptions);
            await this.profileCharacteristicsTypeRepository.remove(profileCharacteristicsType);
            return 'Characteristics deleted successfully';
        }
        catch (error) {
            if (error instanceof common_1.NotFoundException) {
                throw new common_1.HttpException(error.message, common_1.HttpStatus.NOT_FOUND);
            }
            else {
                throw new common_1.HttpException('Internal Server Error', common_1.HttpStatus.INTERNAL_SERVER_ERROR);
            }
        }
    }
    async getProfileCharacteristicsTypes() {
        return await this.profileCharacteristicsTypeRepository.find();
    }
    async createCharacteristicsPossibleOptionsNameBased(createOptionsDto) {
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
                throw new common_1.HttpException(errorMessage, common_1.HttpStatus.CONFLICT);
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
            if (!characteristicsType || !profileCharacteristicsType) {
                throw new common_1.NotFoundException('ProfileCharacteristicsType or CharacteristicsType not found');
            }
            const characteristicsPossibleOptions = this.characteristicsPossibleOptionsRepository.create({
                profileCharacteristicsType: [profileCharacteristicsType],
                characteristicsType: [characteristicsType],
                possibleOptions: createOptionsDto.possibleOptions,
            });
            console.log(characteristicsPossibleOptions);
            const savedOptions = await this.characteristicsPossibleOptionsRepository.save(characteristicsPossibleOptions);
            return characteristicsPossibleOptions;
        }
        catch (error) {
            if (error instanceof common_1.NotFoundException) {
                throw new common_1.NotFoundException('ProfileCharacteristicsType or CharacteristicsType not found');
            }
            else {
                throw error;
            }
        }
    }
    async deletePossibleOptions(dto) {
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
                throw new common_1.NotFoundException('CharacteristicsPossibleOptions not found');
            }
            const possibleOptionsId = characteristicsPossibleOptions.id;
            await this.characteristicsRepository.delete({
                characteristicsPossibleOptions: { id: possibleOptionsId },
            });
            await this.characteristicsPossibleOptionsRepository.delete({
                id: possibleOptionsId,
            });
            return {
                status: common_1.HttpStatus.OK,
                message: 'CharacteristicsPossibleOptions deleted successfully',
            };
        }
        catch (error) {
            console.error('Error in deletePossibleOptions method:', error);
            if (error instanceof common_1.NotFoundException) {
                throw new common_1.HttpException(error.message, common_1.HttpStatus.NOT_FOUND);
            }
            else {
                throw new common_1.HttpException('Internal Server Error', common_1.HttpStatus.INTERNAL_SERVER_ERROR);
            }
        }
    }
    async updatePossibleOptions(dto, updateOptionsDto) {
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
                throw new common_1.NotFoundException('CharacteristicsPossibleOptions not found');
            }
            characteristicsPossibleOptions.possibleOptions = updateOptionsDto.updatedPossibleOptions;
            await this.characteristicsPossibleOptionsRepository.save(characteristicsPossibleOptions);
            return {
                status: common_1.HttpStatus.OK,
                message: 'CharacteristicsPossibleOptions updated successfully',
            };
        }
        catch (error) {
            if (error instanceof common_1.NotFoundException) {
                throw new common_1.HttpException(error.message, common_1.HttpStatus.NOT_FOUND);
            }
            else {
                throw new common_1.HttpException('Internal Server Error', common_1.HttpStatus.INTERNAL_SERVER_ERROR);
            }
        }
    }
    async getAllPossibleOptions() {
        try {
            const options = await this.characteristicsPossibleOptionsRepository.find({
                relations: [
                    'profileCharacteristicsType',
                    'characteristicsType'
                ],
            });
            if (!options || options.length === 0) {
                throw new common_1.NotFoundException('No options found');
            }
            return options;
        }
        catch (error) {
            this.logger.error('Error retrieving options', error);
            throw new common_1.NotFoundException('Failed to retrieve options', error);
        }
    }
    async getOptionsByCharacteristicsName(params) {
        try {
            const options = await this.characteristicsPossibleOptionsRepository.find({
                where: {
                    characteristicsType: { variable_type: params.characteristicsTypeName },
                    profileCharacteristicsType: { profile_characteristic_type: params.profileCharacteristicsTypeName },
                },
            });
            if (!options || options.length === 0) {
                throw new common_1.NotFoundException('No options found for the given Names');
            }
            return options;
        }
        catch (error) {
            this.logger.error('Error retrieving options', error);
            throw new common_1.NotFoundException('Failed to retrieve options', error);
        }
    }
    async getOptionsId(params) {
        try {
            const options = await this.characteristicsPossibleOptionsRepository.findOne({
                where: {
                    characteristicsType: { variable_type: params.characteristicsTypeName },
                    profileCharacteristicsType: { profile_characteristic_type: params.profileCharacteristicsTypeName },
                    possibleOptions: params.possibleOptions,
                },
            });
            if (!options) {
                throw new common_1.NotFoundException('No options found for the given Names');
            }
            return options;
        }
        catch (error) {
            this.logger.error('Error retrieving options', error);
            throw new common_1.NotFoundException('Failed to retrieve options', error);
        }
    }
    async createCharacteristics(createCharacteristicsDto) {
        try {
            const existingCharacteristic = await this.characteristicsRepository.findOne({
                where: {
                    name: createCharacteristicsDto.name,
                },
            });
            if (existingCharacteristic) {
                const errorMessage = 'Characteristic with same name already exists';
                throw new common_1.HttpException(errorMessage, common_1.HttpStatus.CONFLICT);
            }
            const characteristicsPossibleOptions = await this.characteristicsPossibleOptionsRepository.findOne({
                where: {
                    id: createCharacteristicsDto.characteristicsPossibleOptionsId,
                },
            });
            if (!characteristicsPossibleOptions) {
                throw new common_1.NotFoundException('CharacteristicsPossibleOptions not found');
            }
            const characteristics = this.characteristicsRepository.create({
                name: createCharacteristicsDto.name,
                category: createCharacteristicsDto.category,
                characteristicsPossibleOptions: characteristicsPossibleOptions,
            });
            const savedCharacteristics = await this.characteristicsRepository.save(characteristics);
            return characteristics;
        }
        catch (error) {
            if (error instanceof common_1.NotFoundException) {
                throw new common_1.NotFoundException('Error creating characteristics');
            }
            else {
                throw error;
            }
        }
    }
    async getAllCharacteristics() {
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
                throw new common_1.NotFoundException('No characteristics found');
            }
            return characteristicsList;
        }
        catch (error) {
            throw new common_1.NotFoundException('Failed to retrieve characteristics', error);
        }
    }
    async getCharacteristicsByName(params) {
        try {
            const characteristic = await this.characteristicsRepository.findOne({
                where: {
                    name: params.name,
                },
                relations: [
                    'characteristicsPossibleOptions',
                    'characteristicsPossibleOptions.profileCharacteristicsType',
                    'characteristicsPossibleOptions.characteristicsType'
                ],
            });
            if (!characteristic) {
                throw new common_1.NotFoundException('No characteristic found for the given name');
            }
            return characteristic;
        }
        catch (error) {
            this.logger.error('Error retrieving characteristic', error);
            throw new common_1.NotFoundException('Failed to retrieve characteristic', error);
        }
    }
    async updateCharacteristics(dto, updateCharacteristicsDto) {
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
                throw new common_1.NotFoundException('Characteristics not found');
            }
            characteristics.name = updateCharacteristicsDto.name;
            characteristics.category = updateCharacteristicsDto.category;
            characteristics.characteristicsPossibleOptions.id = updateCharacteristicsDto.characteristicsPossibleOptionsId;
            await this.characteristicsRepository.save(characteristics);
            return {
                status: common_1.HttpStatus.OK,
                message: 'Characteristics updated successfully',
            };
        }
        catch (error) {
            if (error instanceof common_1.NotFoundException) {
                throw new common_1.HttpException(error.message, common_1.HttpStatus.NOT_FOUND);
            }
            else {
                throw new common_1.HttpException('Internal Server Error', common_1.HttpStatus.INTERNAL_SERVER_ERROR);
            }
        }
    }
    async deleteCharacteristics(params) {
        try {
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
                throw new common_1.NotFoundException('Characteristics not found');
            }
            await this.characteristicsRepository.delete(characteristic.id);
            return {
                status: common_1.HttpStatus.OK,
                message: 'Characteristics deleted successfully',
            };
        }
        catch (error) {
            if (error instanceof common_1.NotFoundException) {
                throw new common_1.HttpException(error.message, common_1.HttpStatus.NOT_FOUND);
            }
            else {
                throw new common_1.HttpException('Internal Server Error', common_1.HttpStatus.INTERNAL_SERVER_ERROR);
            }
        }
    }
};
exports.CharacteristicsService = CharacteristicsService;
exports.CharacteristicsService = CharacteristicsService = CharacteristicsService_1 = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(CharacteristicsType_1.CharacteristicsType)),
    __param(1, (0, typeorm_1.InjectRepository)(ProfileCharacteristicsType_1.ProfileCharacteristicsType)),
    __param(2, (0, typeorm_1.InjectRepository)(CharacteristicsPossibleOptions_1.CharacteristicsPossibleOptions)),
    __param(3, (0, typeorm_1.InjectRepository)(Characteristics_1.Characteristics)),
    __param(4, (0, typeorm_1.InjectRepository)(ObjectCharacteristicsAssociation_1.ObjectCharacteristicsAssociation)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository])
], CharacteristicsService);
//# sourceMappingURL=characteristics.service.js.map