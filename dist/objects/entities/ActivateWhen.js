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
exports.ActivateWhen = void 0;
const typeorm_1 = require("typeorm");
const Characteristics_1 = require("../../characteristics/entities/Characteristics");
const Carousels_1 = require("./Carousels");
const MealCards_1 = require("./MealCards");
const Calculators_1 = require("./Calculators");
const Articles_1 = require("./Articles");
const Forms_1 = require("./Forms");
let ActivateWhen = class ActivateWhen {
};
exports.ActivateWhen = ActivateWhen;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)({ type: 'bigint' }),
    __metadata("design:type", Number)
], ActivateWhen.prototype, "ID", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'datetime', nullable: true }),
    __metadata("design:type", Date)
], ActivateWhen.prototype, "datetime_value", void 0);
__decorate([
    (0, typeorm_1.ManyToMany)(() => Characteristics_1.Characteristics, characteristics => characteristics.activate_whens),
    __metadata("design:type", Array)
], ActivateWhen.prototype, "characteristics", void 0);
__decorate([
    (0, typeorm_1.ManyToMany)(() => Carousels_1.Carousels, carousels => carousels.activate_whens),
    __metadata("design:type", Array)
], ActivateWhen.prototype, "carousels", void 0);
__decorate([
    (0, typeorm_1.ManyToMany)(() => MealCards_1.MealCards, mealCards => mealCards.activate_whens),
    __metadata("design:type", Array)
], ActivateWhen.prototype, "mealCards", void 0);
__decorate([
    (0, typeorm_1.ManyToMany)(() => Calculators_1.Calculators, calculators => calculators.activate_whens),
    __metadata("design:type", Array)
], ActivateWhen.prototype, "calculators", void 0);
__decorate([
    (0, typeorm_1.ManyToMany)(() => Articles_1.Articles, articles => articles.activate_whens),
    __metadata("design:type", Array)
], ActivateWhen.prototype, "articles", void 0);
__decorate([
    (0, typeorm_1.ManyToMany)(() => Forms_1.Forms, forms => forms.activate_whens),
    __metadata("design:type", Array)
], ActivateWhen.prototype, "forms", void 0);
exports.ActivateWhen = ActivateWhen = __decorate([
    (0, typeorm_1.Entity)('activateWhen')
], ActivateWhen);
//# sourceMappingURL=ActivateWhen.js.map