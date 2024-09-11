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
exports.ActivateUntil = void 0;
const typeorm_1 = require("typeorm");
const Characteristics_1 = require("../../characteristics/entities/Characteristics");
const Carousels_1 = require("../entities/Carousels");
const MealCards_1 = require("../entities/MealCards");
const Calculators_1 = require("../entities/Calculators");
const Articles_1 = require("../entities/Articles");
const Forms_1 = require("../entities/Forms");
let ActivateUntil = class ActivateUntil {
};
exports.ActivateUntil = ActivateUntil;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)({ type: 'bigint' }),
    __metadata("design:type", Number)
], ActivateUntil.prototype, "ID", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'datetime', nullable: true }),
    __metadata("design:type", Date)
], ActivateUntil.prototype, "datetime_value", void 0);
__decorate([
    (0, typeorm_1.ManyToMany)(() => Characteristics_1.Characteristics, characteristics => characteristics.activate_untils),
    __metadata("design:type", Array)
], ActivateUntil.prototype, "characteristics", void 0);
__decorate([
    (0, typeorm_1.ManyToMany)(() => Carousels_1.Carousels, carousels => carousels.activate_untils),
    __metadata("design:type", Array)
], ActivateUntil.prototype, "carousels", void 0);
__decorate([
    (0, typeorm_1.ManyToMany)(() => MealCards_1.MealCards, mealCards => mealCards.activate_untils),
    __metadata("design:type", Array)
], ActivateUntil.prototype, "mealCards", void 0);
__decorate([
    (0, typeorm_1.ManyToMany)(() => Calculators_1.Calculators, calculators => calculators.activate_untils),
    __metadata("design:type", Array)
], ActivateUntil.prototype, "calculators", void 0);
__decorate([
    (0, typeorm_1.ManyToMany)(() => Articles_1.Articles, articles => articles.activate_untils),
    __metadata("design:type", Array)
], ActivateUntil.prototype, "articles", void 0);
__decorate([
    (0, typeorm_1.ManyToMany)(() => Forms_1.Forms, forms => forms.activate_untils),
    __metadata("design:type", Array)
], ActivateUntil.prototype, "forms", void 0);
exports.ActivateUntil = ActivateUntil = __decorate([
    (0, typeorm_1.Entity)('activateUntil')
], ActivateUntil);
//# sourceMappingURL=ActivateUntil.js.map