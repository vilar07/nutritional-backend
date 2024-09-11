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
exports.AssociateObjectOptionDTO = exports.UpdateAssociationDTO = exports.AssociateObjectDTO = exports.AssociationItemDTO = exports.UpdateArticleDTO = exports.CreateCalculatorDTO = exports.CreateArticleDTO = exports.GetObjectByIDdto = void 0;
const swagger_1 = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
class GetObjectByIDdto {
}
exports.GetObjectByIDdto = GetObjectByIDdto;
__decorate([
    (0, swagger_1.ApiProperty)(),
    (0, class_validator_1.IsNotEmpty)({ message: 'Object id cannot be empty' }),
    __metadata("design:type", Number)
], GetObjectByIDdto.prototype, "id", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    (0, class_validator_1.IsNotEmpty)({ message: 'Object type cannot be empty' }),
    __metadata("design:type", String)
], GetObjectByIDdto.prototype, "objectType", void 0);
class CreateArticleDTO {
}
exports.CreateArticleDTO = CreateArticleDTO;
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'The title of the article', type: 'string' }),
    (0, class_validator_1.IsNotEmpty)({ message: 'Title cannot be empty' }),
    __metadata("design:type", String)
], CreateArticleDTO.prototype, "title", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'The subtitle of the article', type: 'string' }),
    (0, class_validator_1.IsNotEmpty)({ message: 'Subtitle cannot be empty' }),
    __metadata("design:type", String)
], CreateArticleDTO.prototype, "subtitle", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'The description of the article', type: 'string' }),
    (0, class_validator_1.IsNotEmpty)({ message: 'Description cannot be empty' }),
    __metadata("design:type", String)
], CreateArticleDTO.prototype, "description", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'The Time of the day (All Day, Morning, Afternoon, Evening)', type: 'string' }),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], CreateArticleDTO.prototype, "time_of_day_relevance", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'The Seasonal relevance (All Year, Spring, Summer, Fall, Winter)', type: 'string' }),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], CreateArticleDTO.prototype, "season_relevance", void 0);
class CreateCalculatorDTO {
}
exports.CreateCalculatorDTO = CreateCalculatorDTO;
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'The title of the calculator', type: 'string' }),
    (0, class_validator_1.IsNotEmpty)({ message: 'Title cannot be empty' }),
    __metadata("design:type", String)
], CreateCalculatorDTO.prototype, "title", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'The subtitle of the calculator', type: 'string' }),
    (0, class_validator_1.IsNotEmpty)({ message: 'Subtitle cannot be empty' }),
    __metadata("design:type", String)
], CreateCalculatorDTO.prototype, "subtitle", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'The description of the calculator', type: 'string' }),
    (0, class_validator_1.IsNotEmpty)({ message: 'Description cannot be empty' }),
    __metadata("design:type", String)
], CreateCalculatorDTO.prototype, "description", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ type: 'string', format: 'binary' }),
    (0, class_validator_1.IsNotEmpty)({ message: 'Image cannot be empty' }),
    __metadata("design:type", Object)
], CreateCalculatorDTO.prototype, "image", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'The variable to calculate', type: 'string' }),
    (0, class_validator_1.IsNotEmpty)({ message: 'Variable cannot be empty' }),
    __metadata("design:type", String)
], CreateCalculatorDTO.prototype, "variable_to_calculate", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'The equation of the calculator', type: 'string' }),
    (0, class_validator_1.IsNotEmpty)({ message: 'Equation cannot be empty' }),
    __metadata("design:type", String)
], CreateCalculatorDTO.prototype, "equation", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'The Time of the day (All Day, Morning, Afternoon, Evening)', type: 'string' }),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], CreateCalculatorDTO.prototype, "time_of_day_relevance", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'The Seasonal relevance (All Year, Spring, Summer, Fall, Winter)', type: 'string' }),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], CreateCalculatorDTO.prototype, "season_relevance", void 0);
class UpdateArticleDTO {
}
exports.UpdateArticleDTO = UpdateArticleDTO;
__decorate([
    (0, swagger_1.ApiProperty)({ required: false }),
    __metadata("design:type", String)
], UpdateArticleDTO.prototype, "title", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ required: false }),
    __metadata("design:type", String)
], UpdateArticleDTO.prototype, "subtitle", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ required: false }),
    __metadata("design:type", String)
], UpdateArticleDTO.prototype, "description", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ required: false }),
    __metadata("design:type", String)
], UpdateArticleDTO.prototype, "time_of_day_relevance", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ required: false }),
    __metadata("design:type", String)
], UpdateArticleDTO.prototype, "season_relevance", void 0);
class AssociationItemDTO {
}
exports.AssociationItemDTO = AssociationItemDTO;
__decorate([
    (0, swagger_1.ApiProperty)(),
    (0, class_validator_1.IsNotEmpty)({ message: 'Characteristic cannot be empty' }),
    __metadata("design:type", String)
], AssociationItemDTO.prototype, "characteristic", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ type: [String] }),
    (0, class_validator_1.IsNotEmpty)({ message: 'Options cannot be empty' }),
    __metadata("design:type", Array)
], AssociationItemDTO.prototype, "options", void 0);
class AssociateObjectDTO {
}
exports.AssociateObjectDTO = AssociateObjectDTO;
__decorate([
    (0, swagger_1.ApiProperty)(),
    (0, class_validator_1.IsNotEmpty)({ message: 'Object Type cannot be empty' }),
    __metadata("design:type", String)
], AssociateObjectDTO.prototype, "objectType", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    (0, class_validator_1.IsNotEmpty)({ message: 'Title cannot be empty' }),
    __metadata("design:type", String)
], AssociateObjectDTO.prototype, "title", void 0);
class UpdateAssociationDTO {
}
exports.UpdateAssociationDTO = UpdateAssociationDTO;
__decorate([
    (0, swagger_1.ApiProperty)(),
    (0, class_validator_1.IsNotEmpty)({ message: 'Object Type cannot be empty' }),
    __metadata("design:type", String)
], UpdateAssociationDTO.prototype, "objectType", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    (0, class_validator_1.IsNotEmpty)({ message: 'Title cannot be empty' }),
    __metadata("design:type", String)
], UpdateAssociationDTO.prototype, "title", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ type: [AssociationItemDTO] }),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Array)
], UpdateAssociationDTO.prototype, "associations", void 0);
class AssociateObjectOptionDTO {
}
exports.AssociateObjectOptionDTO = AssociateObjectOptionDTO;
__decorate([
    (0, swagger_1.ApiProperty)(),
    (0, class_validator_1.IsNotEmpty)({ message: 'Option cannot be empty' }),
    __metadata("design:type", String)
], AssociateObjectOptionDTO.prototype, "option", void 0);
//# sourceMappingURL=objects.dto.js.map