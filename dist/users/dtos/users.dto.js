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
Object.defineProperty(exports, "__esModule", { value: true });
exports.AssociateCharacteristicsDto = exports.CharacteristicOptionDto = exports.CreateUserDto = void 0;
const swagger_1 = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
class CreateUserDto {
}
exports.CreateUserDto = CreateUserDto;
__decorate([
    (0, swagger_1.ApiProperty)(),
    (0, class_validator_1.IsNotEmpty)({ message: 'Username cannot be empty' }),
    __metadata("design:type", String)
], CreateUserDto.prototype, "username", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    (0, class_validator_1.IsNotEmpty)({ message: 'User email cannot be empty' }),
    __metadata("design:type", String)
], CreateUserDto.prototype, "email", void 0);
class CharacteristicOptionDto {
}
exports.CharacteristicOptionDto = CharacteristicOptionDto;
__decorate([
    (0, swagger_1.ApiProperty)(),
    (0, class_validator_1.IsNotEmpty)({ message: 'Characteristic cannot be empty' }),
    __metadata("design:type", String)
], CharacteristicOptionDto.prototype, "characteristic", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    (0, class_validator_1.IsNotEmpty)({ message: 'Option selected cannot be empty' }),
    __metadata("design:type", String)
], CharacteristicOptionDto.prototype, "option_selected", void 0);
class AssociateCharacteristicsDto {
}
exports.AssociateCharacteristicsDto = AssociateCharacteristicsDto;
__decorate([
    (0, swagger_1.ApiProperty)({ type: [CharacteristicOptionDto] }),
    __metadata("design:type", Array)
], AssociateCharacteristicsDto.prototype, "characteristics", void 0);
//# sourceMappingURL=users.dto.js.map