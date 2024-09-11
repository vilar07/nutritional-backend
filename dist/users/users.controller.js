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
var UsersController_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.UsersController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const common_2 = require("@nestjs/common");
const users_service_1 = require("./users.service");
const common_3 = require("@nestjs/common");
const users_dto_1 = require("./dtos/users.dto");
const swagger_2 = require("@nestjs/swagger");
let UsersController = UsersController_1 = class UsersController {
    constructor(usersService) {
        this.usersService = usersService;
        this.logger = new common_2.Logger(UsersController_1.name);
    }
    async getUserCharacteristicMatrix() {
        return await this.usersService.generateUserCharacteristicMatrix();
    }
    async getUsers() {
        return await this.usersService.getUsers();
    }
    async getUserByEmail(email) {
        return await this.usersService.getUserByEmail(email);
    }
    async createUser(createUserDto) {
        return await this.usersService.createUser(createUserDto);
    }
    async deleteUser(email) {
        return await this.usersService.deleteUser(email);
    }
    async getUsersByCharacteristic(characteristic) {
        return await this.usersService.getUsersCountByCharacteristic(characteristic);
    }
    async getUserCharacteristics(email) {
        return await this.usersService.getUserCharacteristics(email);
    }
    async associateCharacteristics(email, associations) {
        return await this.usersService.associateCharacteristics(email, associations);
    }
    async getRecommendations(email) {
        return await this.usersService.getRecommendations(email);
    }
};
exports.UsersController = UsersController;
__decorate([
    (0, common_1.Get)('/characteristic-matrix'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], UsersController.prototype, "getUserCharacteristicMatrix", null);
__decorate([
    (0, common_1.Get)(),
    (0, swagger_2.ApiOperation)({ summary: 'Get All Users' }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], UsersController.prototype, "getUsers", null);
__decorate([
    (0, common_1.Get)('/:email'),
    (0, swagger_2.ApiOperation)({ summary: 'Get an User by email' }),
    __param(0, (0, common_3.Param)('email')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], UsersController.prototype, "getUserByEmail", null);
__decorate([
    (0, common_1.Post)(),
    (0, swagger_2.ApiOperation)({ summary: 'Create an User' }),
    __param(0, (0, common_3.Body)(new common_3.ValidationPipe())),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [users_dto_1.CreateUserDto]),
    __metadata("design:returntype", Promise)
], UsersController.prototype, "createUser", null);
__decorate([
    (0, common_1.Delete)('/:email'),
    (0, swagger_2.ApiOperation)({ summary: 'Delete an User' }),
    __param(0, (0, common_3.Param)('email')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], UsersController.prototype, "deleteUser", null);
__decorate([
    (0, common_1.Get)('/characteritics/count/:characteristic'),
    (0, swagger_2.ApiOperation)({ summary: 'Get the number of users of a characteristic with each option' }),
    __param(0, (0, common_3.Param)('characteristic')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], UsersController.prototype, "getUsersByCharacteristic", null);
__decorate([
    (0, common_1.Get)('/characteritics/:email'),
    (0, swagger_2.ApiOperation)({ summary: 'Get Characteristics of an User' }),
    __param(0, (0, common_3.Param)('email')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], UsersController.prototype, "getUserCharacteristics", null);
__decorate([
    (0, common_1.Post)('/characteritics/:email'),
    (0, swagger_2.ApiOperation)({ summary: 'Associate Characteristics to an User' }),
    __param(0, (0, common_3.Param)('email')),
    __param(1, (0, common_3.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, users_dto_1.AssociateCharacteristicsDto]),
    __metadata("design:returntype", Promise)
], UsersController.prototype, "associateCharacteristics", null);
__decorate([
    (0, common_1.Get)('/recommendations/:email'),
    (0, swagger_2.ApiOperation)({ summary: 'Get Recommendations for an User' }),
    __param(0, (0, common_3.Param)('email')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], UsersController.prototype, "getRecommendations", null);
exports.UsersController = UsersController = UsersController_1 = __decorate([
    (0, swagger_1.ApiTags)('Users'),
    (0, common_1.Controller)('users'),
    __metadata("design:paramtypes", [users_service_1.UsersService])
], UsersController);
//# sourceMappingURL=users.controller.js.map