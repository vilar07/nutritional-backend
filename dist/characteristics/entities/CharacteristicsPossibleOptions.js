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
exports.CharacteristicsPossibleOptions = void 0;
const typeorm_1 = require("typeorm");
const CharacteristicsType_1 = require("./CharacteristicsType");
const ProfileCharacteristicsType_1 = require("./ProfileCharacteristicsType");
let CharacteristicsPossibleOptions = class CharacteristicsPossibleOptions {
};
exports.CharacteristicsPossibleOptions = CharacteristicsPossibleOptions;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)(),
    __metadata("design:type", Number)
], CharacteristicsPossibleOptions.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], CharacteristicsPossibleOptions.prototype, "possibleOptions", void 0);
__decorate([
    (0, typeorm_1.ManyToMany)(() => ProfileCharacteristicsType_1.ProfileCharacteristicsType, profileCharacteristicsType => profileCharacteristicsType.characteristicsPossibleOptions),
    (0, typeorm_1.JoinTable)(),
    __metadata("design:type", Array)
], CharacteristicsPossibleOptions.prototype, "profileCharacteristicsType", void 0);
__decorate([
    (0, typeorm_1.ManyToMany)(() => CharacteristicsType_1.CharacteristicsType, characteristicsType => characteristicsType.characteristicsPossibleOptions),
    (0, typeorm_1.JoinTable)(),
    __metadata("design:type", Array)
], CharacteristicsPossibleOptions.prototype, "characteristicsType", void 0);
exports.CharacteristicsPossibleOptions = CharacteristicsPossibleOptions = __decorate([
    (0, typeorm_1.Entity)("characteristicsPossibleOptions")
], CharacteristicsPossibleOptions);
//# sourceMappingURL=CharacteristicsPossibleOptions.js.map