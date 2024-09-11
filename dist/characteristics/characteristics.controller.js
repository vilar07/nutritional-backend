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
var CharacteristicsController_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.CharacteristicsController = void 0;
const common_1 = require("@nestjs/common");
const characteristics_service_1 = require("./characteristics.service");
const characteristics_dto_1 = require("./dtos/characteristics.dto");
const swagger_1 = require("@nestjs/swagger");
let CharacteristicsController = CharacteristicsController_1 = class CharacteristicsController {
    constructor(characteristicsService) {
        this.characteristicsService = characteristicsService;
        this.logger = new common_1.Logger(CharacteristicsController_1.name);
    }
    async getCharacteristicsTypes() {
        return await this.characteristicsService.getCharacteristicsTypes();
    }
    async createCharacteristicsType(createCharacteristicsTypeDto) {
        return await this.characteristicsService.createCharacteristicsType(createCharacteristicsTypeDto);
    }
    async updateCharacteristicsType(params, dto) {
        return await this.characteristicsService.updateCharacteristicsType(params, dto);
    }
    async deleteCharacteristicsType(params) {
        return await this.characteristicsService.deleteCharacteristicsType(params);
    }
    async getProfileCharacteristicsTypes() {
        return await this.characteristicsService.getProfileCharacteristicsTypes();
    }
    async createProfileCharacteristicsType(createProfileCharacteristicsTypeDto) {
        return await this.characteristicsService.createProfileCharacteristicsType(createProfileCharacteristicsTypeDto);
    }
    async updateProfileCharacteristicsType(params, dto) {
        return await this.characteristicsService.updateProfileCharacteristicsType(params, dto);
    }
    async deleteProfileCharacteristicsType(params) {
        return await this.characteristicsService.deleteProfileCharacteristicsType(params);
    }
    async getAllPossibleOptions() {
        return await this.characteristicsService.getAllPossibleOptions();
    }
    async getOptionsByCharacteristicsName(params) {
        return await this.characteristicsService.getOptionsByCharacteristicsName(params);
    }
    async getOptionsByIds(params) {
        return await this.characteristicsService.getOptionsId(params);
    }
    async createPossibleOptionsNameBased(createOptionsDto) {
        return await this.characteristicsService.createCharacteristicsPossibleOptionsNameBased(createOptionsDto);
    }
    async updatePossibleOptions(params, updateOptionsDto) {
        return await this.characteristicsService.updatePossibleOptions(params, updateOptionsDto);
    }
    async deletePossibleOptions(params) {
        return await this.characteristicsService.deletePossibleOptions(params);
    }
    async getAllCharacteristics() {
        return this.characteristicsService.getAllCharacteristics();
    }
    async getCharacteristicsByName(params) {
        return await this.characteristicsService.getCharacteristicsByName(params);
    }
    async createCharacteristics(createCharacteristicsDto) {
        return await this.characteristicsService.createCharacteristics(createCharacteristicsDto);
    }
    async updateCharacteristics(params, dto) {
        return await this.characteristicsService.updateCharacteristics(params, dto);
    }
    async deleteCharacteristics(params) {
        return await this.characteristicsService.deleteCharacteristics(params);
    }
};
exports.CharacteristicsController = CharacteristicsController;
__decorate([
    (0, common_1.Get)('types'),
    (0, swagger_1.ApiOperation)({ summary: 'Get all characteristic types' }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], CharacteristicsController.prototype, "getCharacteristicsTypes", null);
__decorate([
    (0, common_1.Post)('type'),
    (0, swagger_1.ApiOperation)({ summary: 'Create a characteristic type' }),
    __param(0, (0, common_1.Body)(new common_1.ValidationPipe())),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [characteristics_dto_1.CreateCharacteristicsTypeDto]),
    __metadata("design:returntype", Promise)
], CharacteristicsController.prototype, "createCharacteristicsType", null);
__decorate([
    (0, common_1.Put)('type/:typeName'),
    (0, swagger_1.ApiOperation)({ summary: 'Update a characteristic type' }),
    __param(0, (0, common_1.Param)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [characteristics_dto_1.CharacteristicsTypeDto, characteristics_dto_1.UpdateCharacteristicsTypeDto]),
    __metadata("design:returntype", Promise)
], CharacteristicsController.prototype, "updateCharacteristicsType", null);
__decorate([
    (0, common_1.Delete)('type/:typeName'),
    (0, swagger_1.ApiOperation)({ summary: 'Delete a characteristic type' }),
    __param(0, (0, common_1.Param)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [characteristics_dto_1.DeleteCharacteristicsTypeDto]),
    __metadata("design:returntype", Promise)
], CharacteristicsController.prototype, "deleteCharacteristicsType", null);
__decorate([
    (0, common_1.Get)('profileTypes'),
    (0, swagger_1.ApiOperation)({ summary: 'Get all profile characteristic types' }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], CharacteristicsController.prototype, "getProfileCharacteristicsTypes", null);
__decorate([
    (0, common_1.Post)('profileType'),
    (0, swagger_1.ApiOperation)({ summary: 'Create a profile characteristic type' }),
    __param(0, (0, common_1.Body)(new common_1.ValidationPipe())),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [characteristics_dto_1.CreateProfileCharacteristicsTypeDto]),
    __metadata("design:returntype", Promise)
], CharacteristicsController.prototype, "createProfileCharacteristicsType", null);
__decorate([
    (0, common_1.Put)('profileType/:typeName'),
    (0, swagger_1.ApiOperation)({ summary: 'Update a profile characteristic type' }),
    __param(0, (0, common_1.Param)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [characteristics_dto_1.CharacteristicsTypeDto, characteristics_dto_1.UpdateCharacteristicsTypeDto]),
    __metadata("design:returntype", Promise)
], CharacteristicsController.prototype, "updateProfileCharacteristicsType", null);
__decorate([
    (0, common_1.Delete)('profileType/:typeName'),
    (0, swagger_1.ApiOperation)({ summary: 'Delete a profile characteristic type' }),
    __param(0, (0, common_1.Param)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [characteristics_dto_1.DeleteCharacteristicsTypeDto]),
    __metadata("design:returntype", Promise)
], CharacteristicsController.prototype, "deleteProfileCharacteristicsType", null);
__decorate([
    (0, common_1.Get)('possibleOptions'),
    (0, swagger_1.ApiOperation)({ summary: 'Get all possible options' }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], CharacteristicsController.prototype, "getAllPossibleOptions", null);
__decorate([
    (0, common_1.Get)('possibleOptionsNameBased/:characteristicsTypeName/:profileCharacteristicsTypeName'),
    (0, swagger_1.ApiOperation)({ summary: 'Get possible options based on characteristicTypeName and  profileCharacteristicTypeName' }),
    __param(0, (0, common_1.Param)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [characteristics_dto_1.GetOptionsByCharacteristicsNameDto]),
    __metadata("design:returntype", Promise)
], CharacteristicsController.prototype, "getOptionsByCharacteristicsName", null);
__decorate([
    (0, common_1.Get)('possibleOptionsId'),
    (0, swagger_1.ApiOperation)({ summary: 'Get possible options ID based on characteristicTypeName and  profileCharacteristicTypeName and possibleOptions' }),
    __param(0, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [characteristics_dto_1.GetOptionsIdDto]),
    __metadata("design:returntype", Promise)
], CharacteristicsController.prototype, "getOptionsByIds", null);
__decorate([
    (0, common_1.Post)('possibleOptionsNameBased'),
    (0, swagger_1.ApiOperation)({ summary: 'Create possible options and associate them with a characteristicsType and a profileCharacteristicsType' }),
    __param(0, (0, common_1.Body)(new common_1.ValidationPipe())),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [characteristics_dto_1.CreateCharacteristicsPossibleOptionsByNameDto]),
    __metadata("design:returntype", Promise)
], CharacteristicsController.prototype, "createPossibleOptionsNameBased", null);
__decorate([
    (0, common_1.Put)('possibleOptions/:characteristicsTypeName/:profileCharacteristicsTypeName/:possibleOptions'),
    (0, swagger_1.ApiOperation)({ summary: 'Update possible options' }),
    __param(0, (0, common_1.Param)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [characteristics_dto_1.CharacteristicsPossibleOptionsDto, characteristics_dto_1.UpdatePossibleOptionsDto]),
    __metadata("design:returntype", Promise)
], CharacteristicsController.prototype, "updatePossibleOptions", null);
__decorate([
    (0, common_1.Delete)('possibleOptions/:characteristicsTypeName/:profileCharacteristicsTypeName/:possibleOptions'),
    (0, swagger_1.ApiOperation)({ summary: 'Delete possible options' }),
    __param(0, (0, common_1.Param)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [characteristics_dto_1.CharacteristicsPossibleOptionsDto]),
    __metadata("design:returntype", Promise)
], CharacteristicsController.prototype, "deletePossibleOptions", null);
__decorate([
    (0, common_1.Get)('characteristics'),
    (0, swagger_1.ApiOperation)({ summary: 'Get all characteristics' }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], CharacteristicsController.prototype, "getAllCharacteristics", null);
__decorate([
    (0, common_1.Get)('characteristics/:name'),
    (0, swagger_1.ApiOperation)({ summary: 'Get characteristics by name' }),
    __param(0, (0, common_1.Param)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [characteristics_dto_1.GetCharacteristicsByNameDto]),
    __metadata("design:returntype", Promise)
], CharacteristicsController.prototype, "getCharacteristicsByName", null);
__decorate([
    (0, common_1.Post)('characteristics'),
    (0, swagger_1.ApiOperation)({ summary: 'Create characteristics' }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [characteristics_dto_1.CreateCharacteristicsDto]),
    __metadata("design:returntype", Promise)
], CharacteristicsController.prototype, "createCharacteristics", null);
__decorate([
    (0, common_1.Put)('characteristics/:name'),
    (0, swagger_1.ApiOperation)({ summary: 'Update characteristics' }),
    __param(0, (0, common_1.Param)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [characteristics_dto_1.GetCharacteristicsByNameDto, characteristics_dto_1.UpdateCharacteristicsDto]),
    __metadata("design:returntype", Promise)
], CharacteristicsController.prototype, "updateCharacteristics", null);
__decorate([
    (0, common_1.Delete)('characteristics/:name'),
    (0, swagger_1.ApiOperation)({ summary: 'Delete characteristics' }),
    __param(0, (0, common_1.Param)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [characteristics_dto_1.GetCharacteristicsByNameDto]),
    __metadata("design:returntype", Promise)
], CharacteristicsController.prototype, "deleteCharacteristics", null);
exports.CharacteristicsController = CharacteristicsController = CharacteristicsController_1 = __decorate([
    (0, swagger_1.ApiTags)('Characteristics'),
    (0, common_1.Controller)('characteristics'),
    __metadata("design:paramtypes", [characteristics_service_1.CharacteristicsService])
], CharacteristicsController);
//# sourceMappingURL=characteristics.controller.js.map