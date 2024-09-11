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
exports.Characteristics = void 0;
const typeorm_1 = require("typeorm");
const CharacteristicsPossibleOptions_1 = require("./CharacteristicsPossibleOptions");
const ActivateWhen_1 = require("../../objects/entities/ActivateWhen");
const ActivateUntil_1 = require("../../objects/entities/ActivateUntil");
const ObjectCharacteristicsAssociation_1 = require("../../objects/entities/ObjectCharacteristicsAssociation");
const UserCharacteristicAssociation_1 = require("../../users/entities/UserCharacteristicAssociation");
let Characteristics = class Characteristics {
};
exports.Characteristics = Characteristics;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)({ type: 'bigint' }),
    __metadata("design:type", Number)
], Characteristics.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar' }),
    __metadata("design:type", String)
], Characteristics.prototype, "name", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], Characteristics.prototype, "category", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' }),
    __metadata("design:type", Date)
], Characteristics.prototype, "created_at", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => CharacteristicsPossibleOptions_1.CharacteristicsPossibleOptions, { nullable: true }),
    (0, typeorm_1.JoinColumn)({ name: 'characteristicPossibleOptions_id' }),
    __metadata("design:type", CharacteristicsPossibleOptions_1.CharacteristicsPossibleOptions)
], Characteristics.prototype, "characteristicsPossibleOptions", void 0);
__decorate([
    (0, typeorm_1.ManyToMany)(() => ObjectCharacteristicsAssociation_1.ObjectCharacteristicsAssociation, objectCharacteristicsAssociations => objectCharacteristicsAssociations.characteristics),
    __metadata("design:type", Array)
], Characteristics.prototype, "objectCharacteristicsAssociations", void 0);
__decorate([
    (0, typeorm_1.ManyToMany)(() => UserCharacteristicAssociation_1.UserCharacteristicAssociation, userCharacteristicAssociation => userCharacteristicAssociation.characteristics),
    __metadata("design:type", Array)
], Characteristics.prototype, "userCharacteristicAssociation", void 0);
__decorate([
    (0, typeorm_1.ManyToMany)(() => ActivateWhen_1.ActivateWhen, activateWhen => activateWhen.characteristics),
    __metadata("design:type", Array)
], Characteristics.prototype, "activate_whens", void 0);
__decorate([
    (0, typeorm_1.ManyToMany)(() => ActivateUntil_1.ActivateUntil, activateUntil => activateUntil.characteristics),
    __metadata("design:type", Array)
], Characteristics.prototype, "activate_untils", void 0);
exports.Characteristics = Characteristics = __decorate([
    (0, typeorm_1.Entity)('characteristics')
], Characteristics);
//# sourceMappingURL=Characteristics.js.map