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
exports.DeleteCharacteristicsTypeDto = exports.GetCharacteristicsByNameDto = exports.GetOptionsIdDto = exports.GetOptionsByCharacteristicsNameDto = exports.UpdatePossibleOptionsDto = exports.CharacteristicsPossibleOptionsDto = exports.UpdateCharacteristicsDto = exports.CreateCharacteristicsDto = exports.DeleteCharacteristicsPossibleOptionsDto = exports.CreateCharacteristicsPossibleOptionsByNameDto = exports.CreateProfileCharacteristicsTypeDto = exports.UpdateCharacteristicsTypeDto = exports.CharacteristicsTypeDto = exports.CreateCharacteristicsTypeDto = void 0;
const swagger_1 = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
class CreateCharacteristicsTypeDto {
}
exports.CreateCharacteristicsTypeDto = CreateCharacteristicsTypeDto;
__decorate([
    (0, swagger_1.ApiProperty)(),
    (0, class_validator_1.IsNotEmpty)({ message: 'Characteristic type cannot be empty' }),
    __metadata("design:type", String)
], CreateCharacteristicsTypeDto.prototype, "variable_type", void 0);
class CharacteristicsTypeDto {
}
exports.CharacteristicsTypeDto = CharacteristicsTypeDto;
__decorate([
    (0, swagger_1.ApiProperty)(),
    (0, class_validator_1.IsNotEmpty)({ message: 'Characteristic type cannot be empty' }),
    __metadata("design:type", String)
], CharacteristicsTypeDto.prototype, "variable_type", void 0);
class UpdateCharacteristicsTypeDto {
}
exports.UpdateCharacteristicsTypeDto = UpdateCharacteristicsTypeDto;
__decorate([
    (0, swagger_1.ApiProperty)(),
    (0, class_validator_1.IsNotEmpty)({ message: 'Updated Characteristic type cannot be empty' }),
    __metadata("design:type", String)
], UpdateCharacteristicsTypeDto.prototype, "updatedTypeName", void 0);
class CreateProfileCharacteristicsTypeDto {
}
exports.CreateProfileCharacteristicsTypeDto = CreateProfileCharacteristicsTypeDto;
__decorate([
    (0, swagger_1.ApiProperty)(),
    (0, class_validator_1.IsNotEmpty)({ message: 'Profile Characteristic type cannot be empty' }),
    __metadata("design:type", String)
], CreateProfileCharacteristicsTypeDto.prototype, "profile_characteristic_type", void 0);
class CreateCharacteristicsPossibleOptionsByNameDto {
}
exports.CreateCharacteristicsPossibleOptionsByNameDto = CreateCharacteristicsPossibleOptionsByNameDto;
__decorate([
    (0, swagger_1.ApiProperty)(),
    (0, class_validator_1.IsNotEmpty)({ message: 'Characteristic profile type cannot be empty' }),
    __metadata("design:type", String)
], CreateCharacteristicsPossibleOptionsByNameDto.prototype, "profileCharacteristicsTypeName", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    (0, class_validator_1.IsNotEmpty)({ message: 'Characteristic type cannot be empty' }),
    __metadata("design:type", String)
], CreateCharacteristicsPossibleOptionsByNameDto.prototype, "characteristicsTypeName", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    (0, class_validator_1.IsNotEmpty)({ message: 'Possible Options cannot be empty' }),
    __metadata("design:type", String)
], CreateCharacteristicsPossibleOptionsByNameDto.prototype, "possibleOptions", void 0);
class DeleteCharacteristicsPossibleOptionsDto {
}
exports.DeleteCharacteristicsPossibleOptionsDto = DeleteCharacteristicsPossibleOptionsDto;
__decorate([
    (0, swagger_1.ApiProperty)(),
    (0, class_validator_1.IsNotEmpty)({ message: 'Characteristic profile type cannot be empty' }),
    __metadata("design:type", String)
], DeleteCharacteristicsPossibleOptionsDto.prototype, "profileCharacteristicsTypeName", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    (0, class_validator_1.IsNotEmpty)({ message: 'Characteristic type cannot be empty' }),
    __metadata("design:type", String)
], DeleteCharacteristicsPossibleOptionsDto.prototype, "characteristicsTypeName", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    (0, class_validator_1.IsNotEmpty)({ message: 'Possible Options cannot be empty' }),
    __metadata("design:type", String)
], DeleteCharacteristicsPossibleOptionsDto.prototype, "possibleOptions", void 0);
class CreateCharacteristicsDto {
}
exports.CreateCharacteristicsDto = CreateCharacteristicsDto;
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], CreateCharacteristicsDto.prototype, "name", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], CreateCharacteristicsDto.prototype, "category", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Number)
], CreateCharacteristicsDto.prototype, "characteristicsPossibleOptionsId", void 0);
class UpdateCharacteristicsDto {
}
exports.UpdateCharacteristicsDto = UpdateCharacteristicsDto;
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], UpdateCharacteristicsDto.prototype, "name", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], UpdateCharacteristicsDto.prototype, "category", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Number)
], UpdateCharacteristicsDto.prototype, "characteristicsPossibleOptionsId", void 0);
class CharacteristicsPossibleOptionsDto {
}
exports.CharacteristicsPossibleOptionsDto = CharacteristicsPossibleOptionsDto;
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], CharacteristicsPossibleOptionsDto.prototype, "characteristicsTypeName", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], CharacteristicsPossibleOptionsDto.prototype, "profileCharacteristicsTypeName", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], CharacteristicsPossibleOptionsDto.prototype, "possibleOptions", void 0);
class UpdatePossibleOptionsDto {
}
exports.UpdatePossibleOptionsDto = UpdatePossibleOptionsDto;
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], UpdatePossibleOptionsDto.prototype, "updatedPossibleOptions", void 0);
class GetOptionsByCharacteristicsNameDto {
}
exports.GetOptionsByCharacteristicsNameDto = GetOptionsByCharacteristicsNameDto;
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], GetOptionsByCharacteristicsNameDto.prototype, "characteristicsTypeName", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], GetOptionsByCharacteristicsNameDto.prototype, "profileCharacteristicsTypeName", void 0);
class GetOptionsIdDto {
}
exports.GetOptionsIdDto = GetOptionsIdDto;
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], GetOptionsIdDto.prototype, "characteristicsTypeName", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], GetOptionsIdDto.prototype, "profileCharacteristicsTypeName", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], GetOptionsIdDto.prototype, "possibleOptions", void 0);
class GetCharacteristicsByNameDto {
}
exports.GetCharacteristicsByNameDto = GetCharacteristicsByNameDto;
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], GetCharacteristicsByNameDto.prototype, "name", void 0);
class DeleteCharacteristicsTypeDto {
}
exports.DeleteCharacteristicsTypeDto = DeleteCharacteristicsTypeDto;
__decorate([
    (0, class_validator_1.IsString)(),
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], DeleteCharacteristicsTypeDto.prototype, "typeName", void 0);
//# sourceMappingURL=characteristics.dto.js.map