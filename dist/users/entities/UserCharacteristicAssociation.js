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
exports.UserCharacteristicAssociation = void 0;
const typeorm_1 = require("typeorm");
const User_1 = require("./User");
const Characteristics_1 = require("../../characteristics/entities/Characteristics");
const class_validator_1 = require("class-validator");
let UserCharacteristicAssociation = class UserCharacteristicAssociation {
};
exports.UserCharacteristicAssociation = UserCharacteristicAssociation;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)({ type: 'bigint' }),
    __metadata("design:type", Number)
], UserCharacteristicAssociation.prototype, "ID", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar' }),
    __metadata("design:type", String)
], UserCharacteristicAssociation.prototype, "option", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'int', default: 0 }),
    (0, class_validator_1.Min)(0, { message: 'Trust level cannot be less than 0' }),
    (0, class_validator_1.Max)(10, { message: 'Trust level cannot be greater than 10' }),
    __metadata("design:type", Number)
], UserCharacteristicAssociation.prototype, "trust_level", void 0);
__decorate([
    (0, typeorm_1.ManyToMany)(() => User_1.User, user => user.userCharacteristicAssociation, { nullable: true }),
    (0, typeorm_1.JoinTable)({ name: 'user_id' }),
    __metadata("design:type", Array)
], UserCharacteristicAssociation.prototype, "user", void 0);
__decorate([
    (0, typeorm_1.ManyToMany)(() => Characteristics_1.Characteristics, characteristic => characteristic.objectCharacteristicsAssociations, { nullable: true }),
    (0, typeorm_1.JoinTable)({ name: 'characteristics_user_id' }),
    __metadata("design:type", Array)
], UserCharacteristicAssociation.prototype, "characteristics", void 0);
exports.UserCharacteristicAssociation = UserCharacteristicAssociation = __decorate([
    (0, typeorm_1.Entity)('UserCharacteristicAssociation')
], UserCharacteristicAssociation);
//# sourceMappingURL=UserCharacteristicAssociation.js.map