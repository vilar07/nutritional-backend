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
exports.ObjectCharacteristicsAssociation = void 0;
const typeorm_1 = require("typeorm");
const Carousels_1 = require("./Carousels");
const MealCards_1 = require("./MealCards");
const Calculators_1 = require("./Calculators");
const Articles_1 = require("./Articles");
const Forms_1 = require("./Forms");
const Characteristics_1 = require("../../characteristics/entities/Characteristics");
let ObjectCharacteristicsAssociation = class ObjectCharacteristicsAssociation {
};
exports.ObjectCharacteristicsAssociation = ObjectCharacteristicsAssociation;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)({ type: 'bigint' }),
    __metadata("design:type", Number)
], ObjectCharacteristicsAssociation.prototype, "ID", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], ObjectCharacteristicsAssociation.prototype, "option_selected", void 0);
__decorate([
    (0, typeorm_1.ManyToMany)(() => Characteristics_1.Characteristics, characteristic => characteristic.objectCharacteristicsAssociations, { nullable: true }),
    (0, typeorm_1.JoinTable)({ name: 'characteristics_id' }),
    __metadata("design:type", Array)
], ObjectCharacteristicsAssociation.prototype, "characteristics", void 0);
__decorate([
    (0, typeorm_1.ManyToMany)(() => Carousels_1.Carousels, carousels => carousels.objectCharacteristicsAssociations, { nullable: true }),
    (0, typeorm_1.JoinTable)({ name: 'carousel_id' }),
    __metadata("design:type", Array)
], ObjectCharacteristicsAssociation.prototype, "carousels", void 0);
__decorate([
    (0, typeorm_1.ManyToMany)(() => MealCards_1.MealCards, mealCards => mealCards.objectCharacteristicsAssociations, { nullable: true }),
    (0, typeorm_1.JoinTable)({ name: 'meal_card_id' }),
    __metadata("design:type", Array)
], ObjectCharacteristicsAssociation.prototype, "mealCards", void 0);
__decorate([
    (0, typeorm_1.ManyToMany)(() => Calculators_1.Calculators, calculators => calculators.objectCharacteristicsAssociations, { nullable: true }),
    (0, typeorm_1.JoinTable)({ name: 'calculator_id' }),
    __metadata("design:type", Array)
], ObjectCharacteristicsAssociation.prototype, "calculators", void 0);
__decorate([
    (0, typeorm_1.ManyToMany)(() => Articles_1.Articles, articles => articles.objectCharacteristicsAssociations, { nullable: true }),
    (0, typeorm_1.JoinTable)({ name: 'article_id' }),
    __metadata("design:type", Array)
], ObjectCharacteristicsAssociation.prototype, "articles", void 0);
__decorate([
    (0, typeorm_1.ManyToMany)(() => Forms_1.Forms, forms => forms.objectCharacteristicsAssociations, { nullable: true }),
    (0, typeorm_1.JoinTable)({ name: 'form_id' }),
    __metadata("design:type", Array)
], ObjectCharacteristicsAssociation.prototype, "forms", void 0);
exports.ObjectCharacteristicsAssociation = ObjectCharacteristicsAssociation = __decorate([
    (0, typeorm_1.Entity)('ObjectCharacteristicsAssociation')
], ObjectCharacteristicsAssociation);
//# sourceMappingURL=ObjectCharacteristicsAssociation.js.map