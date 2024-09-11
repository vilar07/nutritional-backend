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
exports.Calculators = void 0;
const typeorm_1 = require("typeorm");
const ActivateWhen_1 = require("./ActivateWhen");
const ActivateUntil_1 = require("./ActivateUntil");
const ObjectCharacteristicsAssociation_1 = require("./ObjectCharacteristicsAssociation");
const ObjectRatings_1 = require("./ObjectRatings");
let Calculators = class Calculators {
};
exports.Calculators = Calculators;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)({ type: 'bigint' }),
    __metadata("design:type", Number)
], Calculators.prototype, "ID", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar' }),
    __metadata("design:type", String)
], Calculators.prototype, "title", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar' }),
    __metadata("design:type", String)
], Calculators.prototype, "subtitle", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'text' }),
    __metadata("design:type", String)
], Calculators.prototype, "description", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar' }),
    __metadata("design:type", String)
], Calculators.prototype, "variable_to_calculate", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar' }),
    __metadata("design:type", String)
], Calculators.prototype, "equation", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', nullable: true }),
    __metadata("design:type", String)
], Calculators.prototype, "image", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'int', default: 0 }),
    __metadata("design:type", Number)
], Calculators.prototype, "views", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', nullable: true }),
    __metadata("design:type", String)
], Calculators.prototype, "time_of_day_relevance", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', nullable: true }),
    __metadata("design:type", String)
], Calculators.prototype, "season_relevance", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' }),
    __metadata("design:type", Date)
], Calculators.prototype, "created_at", void 0);
__decorate([
    (0, typeorm_1.ManyToMany)(() => ActivateWhen_1.ActivateWhen, activateWhen => activateWhen.calculators),
    __metadata("design:type", Array)
], Calculators.prototype, "activate_whens", void 0);
__decorate([
    (0, typeorm_1.ManyToMany)(() => ActivateUntil_1.ActivateUntil, activateUntil => activateUntil.calculators),
    __metadata("design:type", Array)
], Calculators.prototype, "activate_untils", void 0);
__decorate([
    (0, typeorm_1.ManyToMany)(() => ObjectCharacteristicsAssociation_1.ObjectCharacteristicsAssociation, objectCharacteristicsAssociations => objectCharacteristicsAssociations.calculators),
    __metadata("design:type", Array)
], Calculators.prototype, "objectCharacteristicsAssociations", void 0);
__decorate([
    (0, typeorm_1.ManyToMany)(() => ObjectRatings_1.ObjectRatings, objectRating => objectRating.calculators),
    __metadata("design:type", Array)
], Calculators.prototype, "ratings", void 0);
exports.Calculators = Calculators = __decorate([
    (0, typeorm_1.Entity)("calculators")
], Calculators);
//# sourceMappingURL=Calculators.js.map