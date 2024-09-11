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
exports.MealCards = void 0;
const typeorm_1 = require("typeorm");
const ActivateWhen_1 = require("./ActivateWhen");
const ActivateUntil_1 = require("./ActivateUntil");
const ObjectCharacteristicsAssociation_1 = require("./ObjectCharacteristicsAssociation");
const ObjectRatings_1 = require("./ObjectRatings");
let MealCards = class MealCards {
};
exports.MealCards = MealCards;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)({ type: 'bigint' }),
    __metadata("design:type", Number)
], MealCards.prototype, "ID", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar' }),
    __metadata("design:type", String)
], MealCards.prototype, "title", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'numeric', precision: 10, scale: 2 }),
    __metadata("design:type", Number)
], MealCards.prototype, "price", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar' }),
    __metadata("design:type", String)
], MealCards.prototype, "category", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar' }),
    __metadata("design:type", String)
], MealCards.prototype, "description", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar' }),
    __metadata("design:type", String)
], MealCards.prototype, "image", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar' }),
    __metadata("design:type", String)
], MealCards.prototype, "link", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'int', default: 0 }),
    __metadata("design:type", Number)
], MealCards.prototype, "number_ingridients", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'int', default: 0 }),
    __metadata("design:type", Number)
], MealCards.prototype, "views", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', nullable: true }),
    __metadata("design:type", String)
], MealCards.prototype, "time_of_day_relevance", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', nullable: true }),
    __metadata("design:type", String)
], MealCards.prototype, "season_relevance", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' }),
    __metadata("design:type", Date)
], MealCards.prototype, "created_at", void 0);
__decorate([
    (0, typeorm_1.ManyToMany)(() => ActivateWhen_1.ActivateWhen, activateWhen => activateWhen.mealCards),
    __metadata("design:type", Array)
], MealCards.prototype, "activate_whens", void 0);
__decorate([
    (0, typeorm_1.ManyToMany)(() => ActivateUntil_1.ActivateUntil, activateUntil => activateUntil.mealCards),
    __metadata("design:type", Array)
], MealCards.prototype, "activate_untils", void 0);
__decorate([
    (0, typeorm_1.ManyToMany)(() => ObjectCharacteristicsAssociation_1.ObjectCharacteristicsAssociation, objectCharacteristicsAssociations => objectCharacteristicsAssociations.mealCards),
    __metadata("design:type", Array)
], MealCards.prototype, "objectCharacteristicsAssociations", void 0);
__decorate([
    (0, typeorm_1.ManyToMany)(() => ObjectRatings_1.ObjectRatings, objectRating => objectRating.mealCards),
    __metadata("design:type", Array)
], MealCards.prototype, "ratings", void 0);
exports.MealCards = MealCards = __decorate([
    (0, typeorm_1.Entity)("mealCards")
], MealCards);
//# sourceMappingURL=MealCards.js.map